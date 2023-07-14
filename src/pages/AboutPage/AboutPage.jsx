import { Container, Typography, Card, CardHeader, CardContent, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import { getCurrentVersion } from '../../data/version';

function About() {
  const [version, setVersion] = useState('');
  useEffect(() => {
    getCurrentVersion().then((value) => setVersion(value));
  });
  return (
    <Container sx={{ padding: { xs: 0, md: 2 }, flexGrow: 1 }}>
      <Stack direction="column" spacing={5}>
        <Card>
          <CardHeader title="About RuleCrafter"></CardHeader>
          <CardContent>
            <Typography variant="h6">Current Version: {version}</Typography>
            <Typography variant="h6">Last Updated: July 13th, 2023</Typography>
            <Typography variant="body1">
              RuleCrafter is a web app for creating, editing, and sharing tabletop game rulesets.
            </Typography>
          </CardContent>
        </Card>
        <Card>
          <CardHeader title="About the Creator"></CardHeader>
          <CardContent>
            <Typography variant="body1">
              My name is Kyle Haltermann and I designed and built RuleCrafter. I&apos;m a software engineer from
              California who&apos;s lifelong hobby has been tabletop gaming, starting with tabletop RPGs but eventually
              transferring mainly to miniatures wargaming. Like most tabletop enthusiasts I&apos;ve always had a head
              full of ideas for my own game system but have never managed to bring one to completion. While it likely
              was not because I didn&apos;t have the right tools, there were a few things that I felt were lacking in
              most text editing software that I thought would have been useful. After thinking about it for long enough
              I decided to build RuleCrafter. I hope it will be as useful to the next generation of tabletop game
              writers as I thought of it becoming!
            </Typography>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  );
}

export default About;
