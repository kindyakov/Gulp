import * as nodePath from 'path'

const rootFolder = nodePath.basename(nodePath.resolve())

const buildFolder = `./dist`
const srcFolder = `./src`

export const path = {
  build: {
    html: `${buildFolder}/`,
    css: `${buildFolder}/css/`,
    js: `${buildFolder}/js/`,
    images: `${buildFolder}/img/`,
    svg: `${buildFolder}/img/`,
    fonts: `${buildFolder}/fonts/`,
    assets: `${buildFolder}/assets/`,
    project: `${buildFolder}/**/*.*`,
    php: `${buildFolder}/php/`,
  },
  src: {
    html: `${srcFolder}/*.html`,
    scss: `${srcFolder}/scss/style.scss`,
    js: `${srcFolder}/js/app.js`,
    images: `${srcFolder}/img/**/*.{jpg,jpeg,png,gif,webp}`,
    svg: `${srcFolder}/img/**/*.svg`,
    svgicons: `${srcFolder}/svgicons/**/*.svg`,
    assets: `${srcFolder}/assets/**/*.*`,
    php: `${srcFolder}/php/**/*.*`,
  },
  watch: {
    html: `${srcFolder}/**/*.html`,
    scss: `${srcFolder}/scss/**/*.scss`,
    js: `${srcFolder}/js/**/*.js`,
    images: `${srcFolder}/img/**/*.{jpg,jpeg,png,gif,webp,svg}`,
    svgicons: `${srcFolder}/svgicons/**/*.svg`,
    assets: `${srcFolder}/assets/**/*.*`,
    php: `${srcFolder}/php/**/*.*`,
  },
  clean: buildFolder,
  buildFolder,
  srcFolder,
  rootFolder,
  ftp: ``
}
