const path = require('path');
const fs = require('fs-extra');
const htmlBeautify = require('js-beautify').html;
const requireFromString = require('require-from-string');

const Vue = require('vue');

let FreshVue = Vue.extend();

Vue.config.silent = true;
const VueCompiler = require('vue-template-compiler');

const { renderToString } = require('vue-server-renderer').createRenderer();
// const { createBundleRenderer } = require('vue-server-renderer');

const domino = require('domino');

global.window = domino.createWindow('<h1>Hello world</h1>');
global.document = global.window.document;

const pages = [];

let site = {};

let oldBundleRenderer;
let bundleRenderer;
// let filePath;

/**
 * Compiles page into Vue Application to get the page render function and places
 * it into a script so that the browser can retrieve the page render function to
 * render the page during Vue mounting.
 *
 * This is to avoid the overhead of compiling the page into Vue application
 * on the client's browser (alleviates FOUC).
 *
 * @param content Page content to be compiled into Vue app
 */
async function compileVuePageAndCreateScript(content, pageConfig, pageAsset) {
  // Compile Vue Page
  const compiled = VueCompiler.compileToFunctions(`<div id="app">${content}</div>`);
  const outputContent = `
    var pageVueRenderFn = ${compiled.render};
    var pageVueStaticRenderFns = [${compiled.staticRenderFns}];
  `;

  // Get script file name
  const pageHtmlFileName = path.basename(pageConfig.resultPath, '.html');
  const scriptFileName = `${pageHtmlFileName}.page-vue-render.js`;

  /*
    * Add the script file path for this page's render function to the page's assets (to populate page.njk).
    * The script file path is the same as the page's file path.
    */
  pageAsset.pageVueRenderJs = scriptFileName;

  // Get script's absolute file path to output script file
  const dirName = path.dirname(pageConfig.resultPath);
  const filePath = path.join(dirName, scriptFileName);

  await fs.outputFile(filePath, outputContent);
}

async function renderVuePage(content) {
  // eslint-disable-next-line global-require
  // FreshVue = Vue.extend();
  // console.log(bundleRenderer);
  // if (oldBundleRenderer) {
  //   const { MarkBindVue } = requireFromString(oldBundleRenderer);
  //   MarkBindVue.uninstall(Vue);
  // }
  // const panel = Vue.component('panel');
  // console.log(panel);
  const { MarkBindVue } = requireFromString(bundleRenderer);
  MarkBindVue.install(FreshVue);
  // Vue.use(MarkBindVue);
  // MarkBindVue.install(FreshVue);
  // FreshVue.use(MarkBindVue);
  // const panel2 = Vue.component('panel');
  // console.log(panel2);
  // Vue.use(MarkBindVue);
  // console.log(bundleRenderer);
  // const template = `<div id="app">${content}</div>`;
  const VueAppPage = new FreshVue({
  //   // template: content,
    template: `<div id="app">${content}</div>`,
    data: {
      searchData: [],
      popoverInnerGetters: {},
      tooltipInnerContentGetter: {},
      fragment: '',
      questions: [],
    },
    props: {
      threshold: Number(0.5),
    },
    methods: {
      searchCallback: () => {},
    },
    provide: {
      hasParentDropdown: true,
      questions: [],
      gotoNextQuestion: true,
    },
  //   // template: '<script>  window.location.href = "gettingStarted.html"</script>',
  });
  // const renderedContent = await bundleRenderer.renderToString(template);
  const renderedContent = await renderToString(VueAppPage);

  return renderedContent;
}

async function renderAllVuePages() {
  pages.forEach((page) => {
    console.log(page);
  });
}

async function updateBundleRenderer(bundle) {
  // bundleRenderer = createBundleRenderer(bundle);
  oldBundleRenderer = bundleRenderer;
  bundleRenderer = bundle;
  // await site.site.buildSourceFiles();
  // bundleRenderer = require('/Users/jamesongwx/Documents/GitHub/markbind/docs/dist/js/markbindvue.min.js');
  pages.forEach(async (pageContentCopy) => {
    const { content, pageConfig, asset, pageNav, pluginManager, page } = pageContentCopy;
    await compileVuePageAndCreateScript(content, pageConfig, asset);
    const renderedContent = await renderVuePage(content);
    const renderedTemplate = pageConfig.template.render(
      page.prepareTemplateData(renderedContent, !!pageNav)); // page.njk

    const outputTemplateHTML = pageConfig.disableHtmlBeautify
      ? htmlBeautify(renderedTemplate, pluginManager.htmlBeautifyOptions)
      : renderedTemplate;

    await fs.outputFile(pageConfig.resultPath, outputTemplateHTML);
    const check = fs.readFileSync(pageConfig.resultPath, 'utf-8');

  });
  console.log('UPDATED1!');
}

const pageVueServerRenderer = {
  compileVuePageAndCreateScript,
  renderVuePage,
  updateBundleRenderer,
  pages,
  site,
};

module.exports = {
  pageVueServerRenderer,
  compileVuePageAndCreateScript,
  renderVuePage,
  updateBundleRenderer,
};
