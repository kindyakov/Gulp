import * as nodePath from 'path'

const dirname = nodePath.resolve()
const rootFolder = nodePath.basename(nodePath.resolve())

const buildFolder = `./dist`
const srcFolder = `./src`
const sharedFolder = `./shared`

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
    video: `${buildFolder}/video/`,
  },
  src: {
    html: `${srcFolder}/*.html`,
    scss: `${srcFolder}/scss/style.scss`,
    scssCritical: `${srcFolder}/scss/critical/*.scss`,
    js: `${srcFolder}/js/app.js`,
    images: `${srcFolder}/img/**/*.{jpg,jpeg,png,gif,webp,ico}`,
    svg: `${srcFolder}/img/**/*.svg`,
    svgicons: `${srcFolder}/svgicons/**/*.svg`,
    assets: `${srcFolder}/assets/**/*.*`,
    php: `${srcFolder}/php/**/*.*`,
    video: `${srcFolder}/video/**/*.{mp3,mp4,avi,mkv,wmv,mov,flv,webm}`,
  },
  shared: {
    css: `${sharedFolder}/css/`
  },
  watch: {
    html: `${srcFolder}/**/*.html`,
    scss: `${srcFolder}/scss/**/*.scss`,
    scssCritical: `${srcFolder}/scss/critical/*.scss`,
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
  sharedFolder,
  dirname,
  ftp: ``
}
