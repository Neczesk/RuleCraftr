import cherryLight from '../pages/utils/exportTemplates/themedStyles/cherryLight';
import cherryDark from '../pages/utils/exportTemplates/themedStyles/cherryDark';
import vaporLight from '../pages/utils/exportTemplates/themedStyles/vaporLight';
import vaporDark from '../pages/utils/exportTemplates/themedStyles/vaporDark';
import rulesetExportStyle from '../pages/utils/exportTemplates/themedStyles/rulesetExportStyle';

export function getCSS(darkMode, theme) {
  let articleStyle;
  let rulesetStyle;
  if (darkMode) {
    if (theme === 'cherry') {
      articleStyle = cherryDark;
      rulesetStyle = rulesetExportStyle;
    } else if (theme === 'vapor') {
      articleStyle = vaporDark;
      rulesetStyle = rulesetExportStyle;
    }
  } else {
    if (theme === 'cherry') {
      articleStyle = cherryLight;
      rulesetStyle = rulesetExportStyle;
    } else if (theme === 'vapor') {
      articleStyle = vaporLight;
      rulesetStyle = rulesetExportStyle;
    }
  }
  return {
    articleStyle,
    rulesetStyle,
  };
}
