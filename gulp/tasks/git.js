import { Octokit } from "@octokit/rest";
import fs from 'fs';
import CyrillicToTranslit from 'cyrillic-to-translit-js';

function checkAndTransliterate(str) {
  const cyrillicPattern = /[а-яё]/i;
  if (cyrillicPattern.test(str)) {
    return new CyrillicToTranslit().transform(str, "_").toLowerCase()
  }
  return str;
}

export const createRepo = (done) => {
  if (app.settings.repoUrl) {
    app.log.warning("Репозиторий уже создан:", app.settings.repoUrl)
    done()
    return
  }

  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
  });

  const repositoryName = checkAndTransliterate(app.path.rootFolder)

  octokit.repos.createForAuthenticatedUser({
    name: `${repositoryName}_dev`,
    description: 'This is my new repository',
    private: true
  }).then(({ data }) => {
    app.log.success("Репозиторий успешно создан:", data.html_url)
    app.settings.repoUrl = data.html_url;
    fs.writeFileSync('settings.json', JSON.stringify(app.settings, null, 2));
    done()
  }).catch((error) => {
    app.log.error("Ошибка при создании репозитория:", error)
  });
};
