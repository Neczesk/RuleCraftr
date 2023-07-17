import {
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  Stack,
  CardHeader,
  CardActions,
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { ColorModeContext } from '../App';
import Carousel from 'react-material-ui-carousel';
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
} from '@mui/lab';
import useUserStore from '../../stores/userStore';
import useRulesetStore from '../../stores/rulesetStore';
import { createDemoRuleset } from '../../data/rulesets';

function Home() {
  const colorModeContext = useContext(ColorModeContext);
  const setRuleset = useRulesetStore((state) => state.setRuleset);
  const user = useUserStore((state) => state.user);
  const navigate = useNavigate();
  return (
    <Container sx={{ padding: { xs: 0, md: 2 }, flexGrow: 1 }}>
      <Stack direction="column" spacing={3}>
        {' '}
        <Card>
          <CardMedia
            component="img"
            image={
              colorModeContext.colorMode === 'light' ? 'logo-bright-no-background.svg' : 'logo-dark-no-background.svg'
            }
            height="400px"
            sx={{ objectFit: 'contain' }}
          />
          <CardContent>
            <Typography variant="body1" align="center">
              {import.meta.env.VITE_APPLICATION_NAME} is the first web app designed specifically for writing tabletop
              game rulesets. It can&apos;t come up with ideas for your or stop you from making your favorite unit game
              breakingly overpowered, but it can help you organize your thoughts, cross reference your own rules so you
              only need to write them once, and export them into a convenient html document for easy reading from any
              device with a web browser. You can get started with a demo
              <Button
                sx={{ padding: 0, textDecoration: 'underline' }}
                variant="text"
                size="small"
                onClick={() => {
                  if (!user?.id) {
                    const demo = createDemoRuleset();
                    setRuleset(demo);
                    setTimeout(() => {
                      navigate('/user/demo/rulesets/demo/editor');
                    }, 100);
                  } else {
                    navigate('/home', { replace: true });
                  }
                }}
              >
                here
              </Button>
            </Typography>
          </CardContent>
        </Card>
        <Card>
          <CardHeader title="Beta Release" />
          <CardContent>
            <Timeline>
              <TimelineItem>
                <TimelineOppositeContent>Beta 1</TimelineOppositeContent>

                <TimelineSeparator>
                  <TimelineDot color="success" />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>First public release</TimelineContent>
              </TimelineItem>
              <TimelineItem>
                <TimelineOppositeContent>Beta 2</TimelineOppositeContent>

                <TimelineSeparator>
                  <TimelineDot />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>First rich text editing overhaul</TimelineContent>
              </TimelineItem>
              <TimelineItem>
                <TimelineOppositeContent>Beta 3</TimelineOppositeContent>

                <TimelineSeparator>
                  <TimelineDot />
                </TimelineSeparator>
                <TimelineContent>First article navigation overhaul</TimelineContent>
              </TimelineItem>
            </Timeline>
            The app is far from complete yet, but the feedback from beta testers is invaluable to developing it further.
            I have big plans for new features and improvements, and with your feedback I can make this app the most
            useful tool anyone can find for making new tabletop games.
          </CardContent>
          <CardActions>
            <Button component={RouterLink} to="/roadmap" color="primary" variant="contained">
              See the full roadmap
            </Button>
          </CardActions>
        </Card>
        <Carousel autoPlay={false} indicators={false} cycleNavigation fullHeightHover swipe>
          <Card>
            <CardHeader title="Organize your work" />
            <CardMedia
              component="img"
              height="500px"
              image="EditorScreenshots/ArticleTreeAndEditorExample.png"
            ></CardMedia>
            <CardContent>
              When you create sections of your ruleset, you can organize them in a hierarchy, letting you quickly set up
              the skeleton of your ruleset and begin editing the parts you want to start with, or quickly find the part
              you want to make changes to.
            </CardContent>
          </Card>
          <Card>
            <CardHeader title="Keep your rules and keywords together" />
            <CardMedia component="img" height="500px" image="EditorScreenshots/KeywordEditorExample.png" />
            <CardContent>
              Create, organize, and edit your special rules, keywords, magic items, or whatever else you&apos;d like to
              call them. You can refer to these when writing your rulesets and link them directly to the rule instead of
              writing it again. And in the final export, these will be organized by tag and added to the end as a
              glossary.
            </CardContent>
          </Card>
          <Card>
            <CardHeader title="Full featured editor" />
            <CardMedia component="img" height="500px" image="EditorScreenshots/Editor.png" />
            <CardContent>
              While the editor is one of the more work in progress components at the moment, it can still be used to
              write the bulk of any game you can think of. Most importantly, you can link to other sections of the
              ruleset or keywords at any point in your articles, preventing the need to rewrite any part of your game.
            </CardContent>
          </Card>
          <Card>
            <CardHeader title="Export your work for others to see" />
            <CardMedia component="img" height="500px" image="EditorScreenshots/ExportExamples.png" />
            <CardContent>
              Export your work to html, easily viewable on any device with a web browser. Using your web browser you can
              also print the ruleset to a pdf, so that it can be seen in nearly any device with a screen. The export
              process generates a table of contents and a keyword glossary for you, as well as preserving all the
              cross-article or keyword links in the ruleset.
            </CardContent>
          </Card>
        </Carousel>
        <Card>
          <CardHeader title="View other people's games" />
          <CardMedia component="img" height="500px" image="EditorScreenshots/rulesetviewer.png" />
          <CardContent>
            You can share your rulesets simply by marking them as public and giving them tags so that people can find
            them. You can also search for and view the rulesets that other people have made. As long as a ruleset is
            public, anyone can view the exported html version of the ruleset.
          </CardContent>
        </Card>
      </Stack>
    </Container>
  );
}

export default Home;
