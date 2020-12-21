import { getFragmentByHash, toBoolean } from '../utils/utils';

export default {
  props: {
    type: {
      type: String,
      default: null,
    },
    expandable: {
      type: Boolean,
      default: true,
    },
    isOpen: {
      type: Boolean,
      default: null,
    },
    expanded: {
      type: Boolean,
      default: null,
    },
    minimized: {
      type: Boolean,
      default: false,
    },
    noSwitch: {
      type: Boolean,
      default: false,
    },
    noClose: {
      type: Boolean,
      default: false,
    },
    popupUrl: {
      type: String,
      default: null,
    },
    src: {
      type: String,
    },
    bottomSwitch: {
      type: Boolean,
      default: true,
    },
    preload: {
      type: Boolean,
      default: false,
    },
    addClass: {
      type: String,
      default: '',
    },
    expandHeaderless: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    // Vue 2.0 coerce migration
    expandableBool() {
      return toBoolean(this.expandable);
    },
    isOpenBool() {
      return toBoolean(this.isOpen);
    },
    expandedBool() {
      return toBoolean(this.expanded);
    },
    minimizedBool() {
      return toBoolean(this.minimized);
    },
    noSwitchBool() {
      return toBoolean(this.noSwitch);
    },
    noCloseBool() {
      return toBoolean(this.noClose);
    },
    bottomSwitchBool() {
      return toBoolean(this.bottomSwitch);
    },
    preloadBool() {
      return toBoolean(this.preload);
    },
    // Vue 2.0 coerce migration end
    hasHeaderBool() {
      return this.$slots.header;
    },
    isExpandableCard() {
      return this.expandableBool;
    },
    hasSrc() {
      return this.src && this.src.length > 0;
    },
    shouldShowHeader() {
      return (!this.localExpanded) || (!this.expandHeaderless);
    },
  },
  data() {
    return {
      localExpanded: false,
      localMinimized: false,
      wasRetrieverLoaded: false,
      expandedPanelHeight: 0, // to be set dynamically
      collapsedPanelHeight: 0,
      previewPanelHeight: 150,
    };
  },
  methods: {
    toggle() {
      console.log(this.type);
      console.log(this.collapsedPanelHeight);
      console.log(this.expandedPanelHeight);
      console.log(this.$refs.panel.style.maxHeight);
      if (this.localExpanded) {
        console.log('collapsing');
        if (this.$refs.panel.style.maxHeight === 'none') {
          console.log('hhuu');
          this.$refs.panel.style.maxHeight = `${this.$refs.panel.scrollHeight}px`;
          this.expandedPanelHeight = this.$refs.panel.scrollHeight; // to circumvent nested panels
        }
        setTimeout(() => {
          this.$refs.panel.style.maxHeight = `${this.collapsedPanelHeight}px`;
        }, 0); // nextTick doesn't work
      } else {
        console.log('expanding');
        this.$refs.panel.style.maxHeight = `${this.expandedPanelHeight}px`;
      }
      this.localExpanded = !this.localExpanded;
    },
    close() {
      this.localExpanded = false;
      this.localMinimized = true;
      this.expandedPanelHeight = this.$refs.panel.scrollHeight; // to circumvent nested panels
      this.$refs.panel.style.maxHeight = `${this.collapsedPanelHeight}px`;
    },
    open() {
      this.localMinimized = false;
      setTimeout(() => {
        this.localExpanded = true;
        this.$refs.panel.style.maxHeight = `${this.expandedPanelHeight}px`;
      }, 50);
    },
    openPopup() {
      window.open(this.popupUrl);
    },
    setMaxHeight() {
      // // Don't play the transition for this case as the loading should feel 'instant'
      // if (this.expandedBool) {
      //   this.$refs.panel.style.maxHeight = 'none';
      //   return;
      // }

      // /*
      // Otherwise, since the vue transition is dependent on localExpanded, we have to manually
      // set our own transition end handlers here for the initial loading of the content.
      // */
      // const onExpandDone = () => {
      //   this.$refs.panel.style.maxHeight = 'none';
      //   this.$refs.panel.removeEventListener('transitionend', onExpandDone);
      // };

      // this.$refs.panel.addEventListener('transitionend', onExpandDone);
      // this.$refs.panel.style.maxHeight = `${this.$refs.panel.scrollHeight}px`;
    },
    // beforeExpand(el) {
    //   el.style.maxHeight = '0';
    // },
    // duringExpand(el) {
    //   jQuery('html').stop();
    //   el.style.maxHeight = `${el.scrollHeight}px`;
    // },
    // afterExpand(el) {
    //   el.style.maxHeight = 'none';
    // },
    // beforeCollapse(el) {
    //   el.style.maxHeight = `${el.scrollHeight}px`;
    // },
    // duringCollapse(el) {
    //   if (this.$el.getBoundingClientRect().top < 0) {
    //     jQuery('html').animate({
    //       scrollTop: window.scrollY + this.$el.getBoundingClientRect().top - 3,
    //     }, 500, 'swing');
    //   }
    //   el.style.maxHeight = '0';
    // },
    setExpandedPanelHeight() {
      this.expandedPanelHeight = this.$refs.panel.scrollHeight;
    },
    setCollapsedPanelHeight() {
      this.collapsedPanelHeight = 0;
    },
    setInitialPanelHeight() {
      if (this.minimizedBool) {
        this.close();
        return;
      }

      const notExpandableNoExpand = !this.expandableBool && this.expanded !== 'false';
      this.localExpanded = notExpandableNoExpand || this.expandedBool;
      if (this.localExpanded === null) {
        this.localExpanded = false;
      }
      if (this.localExpanded) {
        this.$refs.panel.style.maxHeight = `${this.expandedPanelHeight}px`;
      } else {
        this.$refs.panel.style.maxHeight = `${this.collapsedPanelHeight}px`;
      }
    },
  },
  created() {
    if (this.src) {
      const hash = getFragmentByHash(this.src);
      if (hash) {
        this.fragment = hash;
        // eslint-disable-next-line prefer-destructuring
        this.src = this.src.split('#')[0];
      }
    }
    // Edge case where user might want non-expandable card that isn't expanded by default
    // const notExpandableNoExpand = !this.expandableBool && this.expanded !== 'false';

    // Set local data to computed prop value

    // Ensure this expr ordering is maintained
    // this.localExpanded = notExpandableNoExpand || this.expandedBool;
    // if (this.localExpanded === null) {
    //   this.localExpanded = false;
    // }
    // If it is expanded, load the retriever immediately.
    // this.localMinimized = false;
    // this.wasRetrieverLoaded = this.localExpanded;
    // this.localMinimized = this.minimizedBool;
  },
  mounted() {
    // expand everything to retrieve the appropriate heights
    this.localMinimized = false;
    this.localExpanded = true;
    this.wasRetrieverLoaded = true;
    this.$nextTick(() => {
      this.setExpandedPanelHeight();
      this.setCollapsedPanelHeight();
      this.setInitialPanelHeight();
      // this.$refs.card.addEventListener('transitionend', () => {
      //   if (this.localExpanded) {
      //     this.$refs.card.style.maxHeight = 'none';
      //   }
      // });
      this.$refs.panel.addEventListener('transitionend', () => {
        if (this.localExpanded) {
          console.log('end');
          this.$refs.panel.style.maxHeight = 'none';
        }
      });
      // this.$refs.panel.addEventListener('transitionstart', () => {
      //   if (this.localExpanded) {
      //     console.log('HERE');
      //     this.$refs.panel.style.maxHeight = `${this.$refs.panel.scrollHeight}px`;
      //   }
      // });
    });
  },
};
