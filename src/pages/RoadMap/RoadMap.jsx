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
            This is the third public release of RuleCrafter. These are the currently known issues:
            <ul>
              <li>The editor is not mobile friendly. Unfortunately that will not become a priority for some time.</li>
              <li>Copying and pasting formatted text does not work as intended.</li>
              <li>In particular this means copying and pasting tables and lists</li>
              <li>
                The context menus (right click menus) do not work as I would like, but I am still searching for ways to
                improve them. In the meantime they are still fully functional.
              </li>
            </ul>
            The most recent updates added several badly needed features to the article content editor, including adding
            support for tables, ordered and unordered lists, and undo and redo support. In addition the article tree has
            been greatly expanded in functionality, allowing you to reparent and duplicate articles, mark articles as
            either exported or non exported, and use articles as folders. There may still be bugs in these features so
            if you find one let me know! There are certainly other bugs and issues that I do not know about, so if you
            find one please join us on Discord and let me know about them too!
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
        <Card>
          <CardHeader title="Alpha 6: Clean up for Beta 1" />
          <CardContent>
            After update 5, I believe the editor will be fit for purpose in terms of features. To prepare for a beta
            release I will be taking time to clean up bugs found during other updates and user feedback, and assessing
            if there are any other features that do need to be added. This update is not fully planned yet so if you
            have feedback, please contact me!
          </CardContent>
        </Card>
      </Stack>
    </Container>
  );
}
export default RoadMap;
