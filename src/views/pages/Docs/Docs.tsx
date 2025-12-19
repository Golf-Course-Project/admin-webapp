import React from 'react';
import { useTheme } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Container from 'common/Container';
import { Grid, Link, Typography } from '@material-ui/core';

const Docs = () => {
  const theme: any = useTheme();

  const pages: any = [{
    title: 'Landing Pages',
    id: 'landing-pages',
    authOnly: false,
    pages: [
      {
        title: 'Advertisement',
        href: '/landing-advertisement',
        authHide: false,
      },
      {
        title: 'Payment App',
        href: '/landing-payment-app',
        authHide: false,
      },
      {
        title: 'Marketing',
        href: '/landing-marketing',
        authHide: false,
      },
      {
        title: 'Software Company',
        href: '/landing-software-company',
        authHide: false,
      },
      {
        title: 'Course',
        href: '/landing-course',
        authHide: false,
      },
      {
        title: 'Crypto Currency',
        href: '/landing-crypto',
        authHide: false,
      },
      {
        title: 'Design Agency',
        href: '/landing-design-agency',
        authHide: false,
      },
      {
        title: 'Consulting',
        href: '/landing-consulting',
        authHide: false,
      },
      {
        title: 'Application',
        href: '/landing-application',
        authHide: false,
      },
      {
        title: 'Domain Hosting',
        href: '/landing-domain-hosting',
        authHide: false,
      },
      {
        title: 'Travel',
        href: '/landing-travel',
        authHide: false,
      },
      {
        title: 'Event',
        href: '/landing-event',
        authHide: false,
      },
    ],
  },
  {
    title: 'Supporting Pages',
    id: 'supporting-pages',
    authOnly: false,
    pages: [
      {
        title: 'Services',
        href: '/page-services',
        authHide: false,
      },
      {
        title: 'Pricing',
        href: '/page-pricing',
        authHide: false,
      },
      {
        title: 'Customers',
        href: '/page-customers',
        authHide: false,
      },
      {
        title: 'Hire Us',
        href: '/page-hire-us',
        authHide: false,
      },
      {
        title: 'FAQ',
        href: '/page-faq',
        authHide: false,
      },
      {
        title: 'Privacy Policy',
        href: '/page-privacy',
        authHide: false,
      },
      {
        title: 'Coming Soon',
        href: '/page-coming-soon',
        authHide: false,
      },
      {
        title: 'Maintenance Mode',
        href: '/page-maintenance-mode',
        authHide: false,
      },
      {
        title: 'Cover',
        href: '/page-cover',
        authHide: false,
      },
      {
        title: 'Not Found',
        href: '/page-not-found',
        authHide: false,
      },
    ],
  },
  {
    title: 'Documentation Pages',
    id: 'doc-pages',
    authOnly: false,
    pages: [
      {
        title: 'Documentation',
        href: '/docs-introduction',
        authHide: false,
      },
    ],
  }];

  return (
    <Box>
      <Box bgcolor={theme.palette.alternate.main}>
        <Container>
          <Box paddingX={2} paddingBottom={2}>
            <Box>
              {pages.map((item: any, i: React.Key | null | undefined) => (
                <Box key={i} marginBottom={4}>
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      marginBottom: 1,
                      display: 'block',
                    }}
                  >
                    {item.title}
                  </Typography>
                  <Grid container spacing={1}>
                    {item.pages.map((p: any, i: React.Key | null | undefined) => (
                      <Grid item xs={6} key={i}>
                        <Link
                          variant="body2"
                          component={'a'}
                          href={p.href}
                          color={'primary'}
                          sx={{
                            fontWeight: 400,
                            '&:hover': {
                              textDecoration: 'none',
                              color: theme.palette.primary.dark,
                            },
                          }}
                        >
                          {p.title}
                        </Link>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              ))}
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Docs;
