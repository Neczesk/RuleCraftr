import { Container, Typography, Paper } from '@mui/material';

function Home() {
  return (
    <Container sx={{ padding: 2, flexGrow: 1 }}>
      <Paper sx={{ padding: 5, height: '100%' }}>
        <Typography align="center" variant="h3">
          {import.meta.env.VITE_APPLICATION_NAME}
        </Typography>
        <Typography variant="body1" align="center">
          {import.meta.env.VITE_APPLICATION_NAME} is a web app designed to help make the process of writing your own set
          of tabletop game rules a little easier. It can{"'"}t come up with ideas for your or stop you from making your
          favorite unit game breakingly overpowered, but it can help you organize your thoughts, cross reference your
          own rules so you only need to write them once, and export them into a convenient html document for easy
          reading from a mobile device, e-reader, or other device.
        </Typography>
        <hr></hr>
        <Typography variant="body1" align="center">
          Welcome alpha testers! As you can probably guess looking at it, the app isn{"'"}t finished yet. I appreciate
          you giving this a try for me. By the time this is published there{"'"}ll be a discord server where you can let
          me know your feedback and any bugs you encounter. As of now, the following features are available:
        </Typography>
        <ul>
          <li>
            Creating your user account (Use the invite code you received from me if you have one, otherwise you{"'"}re
            not getting in yet)
          </li>
          <li>Actual aesthetic design, including dark and light mode</li>
          <li>
            Within the ruleset editor, you can edit sections (called articles), organize them into a heirarchy, and edit
            their contents. Inside a ruleset you also have access to keywords, which you can create and reference
            through articles.
          </li>
          <li>
            Exporting a ruleset to html for easier reading. You can also export and view public rulesets in addition to
            the ones you{"'"}ve created.
          </li>
        </ul>
        <Typography variant="body" align="center">
          The following features are as of yet unavailable but are currently planned for the beta release:
        </Typography>
        <ul>
          <li>Better support for smaller screen widths, including possibly mobile devices (but no promises)</li>
          <li>
            Minimizing the article tree (the left panel) and the keyword inspector (right panel) to give you the maximum
            space for your editing
          </li>
          <li>Pagination and searching of the keywords in a ruleset</li>
          <li>
            Pagination and searching of the rulesets that you created and those of other users that are set public
          </li>
        </ul>
      </Paper>
    </Container>
  );
}

export default Home;
