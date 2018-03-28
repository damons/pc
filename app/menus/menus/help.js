const {release} = require('os');
const {app, shell} = require('electron');

const {getConfig, getPlugins} = require('../../config');
const {arch, env, platform, versions} = process;
const {version} = require('../../package.json');

module.exports = (commands, showAbout) => {
  const submenu = [
    {
      label: `${app.getName()} Website`,
      click() {
        shell.openExternal('https://pc.is');
      }
    },
    {
      label: 'Report Issue',
      click() {
        const body = `
<!--
  Hi there! Thank you for discovering and submitting an issue.
  Before you submit this; let's make sure of a few things.
  Please make sure the following boxes are ✅ if they are correct.
  If not, please try and fulfil these first.
-->
<!-- 👉 Checked checkbox should look like this: [x] -->
  - [ ] Your pc.app version is **${version}**. Please verify your using the [latest](https://github.com/monadicus/pc/releases/latest) pc.app version
  - [ ] I have searched the [issues](https://github.com/monadicus/pc/issues) of this repo and believe that this is not a duplicate

  ---
  - **Any relevant information from devtools?** _(CMD+ALT+I on macOS, CTRL+SHIFT+I elsewhere)_:
<!-- 👉 Replace with info if applicable, or N/A -->

  - **Is the issue reproducible in vanilla pc.app?**
<!-- 👉 Replace with info if applicable, or Is Vanilla. (Vanilla means pc.app without any add-ons or extras. Straight out of the box.) -->

## Issue
<!-- 👉 Now feel free to write your issue, but please be descriptive! Thanks again 🙌 ❤️ -->






<!-- ~/.pc.js config -->
 - **${app.getName()} version**: ${env.TERM_PROGRAM_VERSION} "${app.getVersion()}"

 - **OS ARCH VERSION:** ${platform} ${arch} ${release()}
 - **Electron:** ${versions.electron}  **LANG:** ${env.LANG}
 - **SHELL:** ${env.SHELL}   **TERM:** ${env.TERM}

  <details>
    <summary><strong> ~/.pc.js contents</strong></summary>
      <pre>
        <code>
          ${JSON.stringify(getConfig(), null, 2)}

          ${JSON.stringify(getPlugins(), null, 2)}
        </code>
      </pre>
  </details>`;

        shell.openExternal(`https://github.com/monadicus/pc/issues/new?body=${encodeURIComponent(body)}`);
      }
    }
  ];

  if (process.platform !== 'darwin') {
    submenu.push(
      {type: 'separator'},
      {
        role: 'about',
        click() {
          showAbout();
        }
      }
    );
  }
  return {
    role: 'help',
    submenu
  };
};
