const path = require('path');
const fs = require('fs-extra');
// const Vue = require('vue');
const VueCompiler = require('vue-template-compiler');

const { renderToString } = require('vue-server-renderer').createRenderer();
// const { createBundleRenderer } = require('vue-server-renderer');

const pages = [];

let bundleRenderer;

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
  const Vue = require('vue');
  Vue.use(bundleRenderer);
  // console.log(bundleRenderer);
  // const template = `<div id="app">${content}</div>`;
  const VueAppPage = new Vue({
  //   // template: content,
    template: `<div id="app">${content}</div>`,
  //   // template: '<script>  window.location.href = "gettingStarted.html"</script>',
  });
  // const renderedContent = await bundleRenderer.renderToString(template);
  const renderedContent = await renderToString(VueAppPage);

  return unescape(renderedContent);
}

async function renderAllVuePages() {
  pages.forEach((page) => {
    console.log(page);
  });
}

function updateBundleRenderer(bundle) {
  // bundleRenderer = createBundleRenderer(bundle);
  bundleRenderer = bundle;
  console.log('updated!');
}

const pageVueServerRenderer = {
  compileVuePageAndCreateScript,
  renderVuePage,
  updateBundleRenderer,
};

module.exports = {
  pageVueServerRenderer,
  compileVuePageAndCreateScript,
  renderVuePage,
  updateBundleRenderer,
};
