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
    showPreview: {
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
    isPreviewCollapsed() {
      return this.showPreview && !this.localExpanded;
    },
  },
  data() {
    return {
      localExpanded: false,
      localMinimized: false,
      wasRetrieverLoaded: false,
      expandedCardHeight: 0,
      collapsedCardHeight: 0,
      collapsedPreviewCardHeight: 180,
    };
  },
  methods: {
    toggle() {
      const toggleHeight = () => {
        console.log(this.type);
        console.log(this.collapsedCardHeight);
        console.log(this.expandedCardHeight);
        if (this.localExpanded) {
          console.log('collapsing');
          this.$refs.card.style.maxHeight = `${this.collapsedCardHeight}px`;
        } else {
          // const func = () => {
          //   this.$refs.card.style.maxHeight = 'none';
          // };
          // this.$refs.card.addEventListener('transitionend', func);
          console.log('expanding');
          this.$refs.card.style.maxHeight = `${this.expandedCardHeight}px`;
        }
        this.localExpanded = !this.localExpanded;
      };
      if (!this.wasRetrieverLoaded && !this.localExpanded) {
        /*
        Let the retriever load before toggling localExpanded which triggers the animation,
        as we need to know the scrollHeight of the content for the animation to work.
        */
        this.wasRetrieverLoaded = true;
        this.$nextTick(() => {
          toggleHeight();
        });
      } else {
        toggleHeight();
      }
    },
    close() {
      this.$refs.card.style.maxHeight = `${this.collapsedCardHeight}px`;
      this.localExpanded = false;
      this.localMinimized = true;
    },
    open() {
      this.localMinimized = false;
      this.localExpanded = true;
      this.$refs.card.style.maxHeight = `${this.expandedCardHeight}px`;
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
    setCollapsedCardHeight() {
      if (this.type === 'minimal') {
        this.collapsedCardHeight = this.$refs.headerWrapper.scrollHeight;
      } else {
        this.collapsedCardHeight = this.$refs.cardHeader.scrollHeight;
      }
      if (this.showPreview) {
        this.collapsedCardHeight += this.collapsedPreviewCardHeight;
      }
    },
    setExpandedCardHeight() {
      this.expandedCardHeight = this.$refs.card.scrollHeight;
      // if (this.localMinimized) {
      //   this.open();
      //   this.$nextTick(() => {
      //     this.expandedCardHeight = this.$refs.card.scrollHeight;
      //     this.close();
      //   });
      // } else {
      //   this.expandedCardHeight = this.$refs.card.scrollHeight;
      // }
    },
    setInitialCardHeight() {
      if (this.localExpanded) {
        this.$refs.card.style.maxHeight = `${this.expandedCardHeight}px`;
      } else {
        this.$refs.card.style.maxHeight = `${this.collapsedCardHeight}px`;
      }
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
    const notExpandableNoExpand = !this.expandableBool && this.expanded !== 'false';

    // Set local data to computed prop value

    // Ensure this expr ordering is maintained
    this.localExpanded = notExpandableNoExpand || this.expandedBool;
    if (this.localExpanded == null) {
      this.localExpanded = false;
    }
    // this.wasRetrieverLoaded = true;
    // If it is expanded, load the retriever immediately.
    // this.wasRetrieverLoaded = this.localExpanded;
    // this.localMinimized = this.minimizedBool;
  },
  mounted() {
    this.wasRetrieverLoaded = true;
    this.$nextTick(() => {
      this.setCollapsedCardHeight();
      this.setExpandedCardHeight();
      this.setInitialCardHeight();
      // this.$refs.card.addEventListener('transitionend', () => {
      //   if (this.localExpanded) {
      //     this.$refs.card.style.maxHeight = 'none';
      //   }
      // });
      // this.$refs.card.addEventListener('transitionend', () => {
      //   if (this.localExpanded) {
      //     this.$refs.card.style.maxHeight = 'none';
      //   }
      // });
      // this.$refs.card.addEventListener('transitionrun', () => {
      //   if (this.localExpanded) {
      //     this.$refs.card.style.maxHeight = this.$refs.card.scrollHeight;
      //   }
      // });
      this.localMinimized = this.minimizedBool;
      // this.localExpanded = this.localMinimized;
    });
  },
};
