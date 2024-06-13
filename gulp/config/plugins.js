import replace from "gulp-replace"
import plumber from "gulp-plumber"
import notify from 'gulp-notify'
import browserSync from "browser-sync"
import newer from "gulp-newer"
import ifPlugin from 'gulp-if'
import chalk from 'chalk'
import through2 from 'through2';

const plugins = {
  replace,
  plumber,
  notify,
  browserSync,
  newer,
  chalk,
  through2,
  if: ifPlugin
}


export default plugins