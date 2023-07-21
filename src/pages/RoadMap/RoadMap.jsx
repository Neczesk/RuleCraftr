import { Card, CardContent, CardHeader, Container, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import { getCurrentVersion } from '../../data/version';

function RoadMap() {
  const [currentVersion, setCurrentVersion] = useState('');
  useEffect(() => {
    getCurrentVersion().then((value) => setCurrentVersion(value));
  });
  return (
    <Container sx={{ padding: { xs: 0, md: 2 }, flexGrow: 1 }}>
      <Stack direction="column" spacing={5}>
        <Card>
          <CardHeader title={currentVersion} />
          <CardContent>
            This is the second public release of RuleCrafter. These are the currently known issues:
            <ul>
              <li>The editor is not mobile friendly. Unfortunately that will not become a priority for some time.</li>
              <li>Copying and pasting formatted text does not work as intended.</li>
              <li>In particular this means copying and pasting tables and lists</li>
            </ul>
            The most recent update added several badly needed features to the article content editor, including adding
            support for tables, ordered and unordered lists, and undo and redo support. There may still be bugs in these
            features so if you find one let me know! There are certainly other bugs and issues that I do not know about,
            so if you find one please join us on Discord and let me know about them!
          </CardContent>
        </Card>
        <Card>
          <CardHeader title="Alpha 3: Article Tree Overhaul" />
          <CardContent>
            The second alpha update will overhaul the article tree. The interface is likely to be updated, but most
            importantly the following features will be added:
            <ul>
              <li>Organizing your articles into folders</li>
              <li>
                Designating articles as non-export, meaning that they won&apos;t be added to the export version of the
                ruleset.
              </li>
              <li>Re-ordering articles and moving them to different parent articles</li>
            </ul>
            Further ideas for features of the article tree may be added as well as the update approaches. If you have
            any ideas, contact me on discord and let me know!
          </CardContent>
        </Card>
        <Card>
          <CardHeader title="Alpha 4: The Boring Update" />
          <CardContent>
            The third alpha update is likely to not add any exciting features, but will be important for keeping the app
            on a steady foundation in the future. I will be profiling the app and paying attention to the data and cpu
            requirements as the user base starts to grow, refactoring the performance of critical parts of the code to
            ensure that it will continue to be acceptably fast as I add more features, and structure the data storage
            aspects of the app to be more flexible. I may take this opportunity to change how resource deletion works,
            so that deleted keywords, articles, and rulesets would be available for a limited period of time for
            restoration. In addition, I will be exploring autosave and versioning of the ruleset, so that users can
            revert to previous versions and know that their changes will never be discarded.
          </CardContent>
        </Card>
        <Card>
          <CardHeader title="Alpha 5: Copy Paste" />
          <CardContent>
            While copy and paste doesn&apos;t seem like it should be a big deal, unfortunately it is a difficult feature
            to implement. I will be taking this opportunity to spend the time needed to make it work. Note, this is only
            to get fully formatted copy and paste to work. Simple text copying and pasting already works fine. If you
            have further suggestions as to what the editor needs to be useful for your project, please join us on
            Discord!
          </CardContent>
        </Card>
      </Stack>
    </Container>
  );
}
export default RoadMap;
