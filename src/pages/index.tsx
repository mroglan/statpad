import {makeStyles} from '@material-ui/core/styles'
import {Grid, Typography, Paper, Button, Box, IconButton} from '@material-ui/core'
import Header from '../components/nav/Header'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import authenticated from '../requests/authenticated'
import Link from 'next/link'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import InfoCarousel from '../components/homePage/InfoCarousel1'
import DonutLargeIcon from '@material-ui/icons/DonutLarge';
import GpsFixedIcon from '@material-ui/icons/GpsFixed';
import getUser from '../requests/getUser'
import Head from 'next/head'

const useStyles = makeStyles(theme => ({
  root: {
    minHeight: '100vh'
  },
  title: {
    color: '#fff',
    fontFamily: 'Monospace'
  },
  lightWhite: {
    color: theme.palette.primary.light
  },
  subTitle: {
    fontFamily: 'Monospace',
    color: theme.palette.primary.light
  },
  card: {
    height: '100%',
    display: 'flex', 
    flexDirection: 'column',
    backgroundColor: 'hsl(241, 82%, 50%)'
  },
  textWhite: {
    color: '#fff'
  },
  descList: {
    '& > li': {
      margin: '.5rem 0',
    },
    color: '#fff'
  },
  successBtn: {
    backgroundColor: 'hsl(140, 81%, 31%)',
    color: '#fff',
    '&:hover': {
        backgroundColor: 'hsl(140, 60%, 31%)'
    },
    margin: '.5rem 0'
  }
}))

export default function Home({loggedIn, user}) {

  const classes = useStyles()
  return (
    <>
    <Head>
      <meta name="description" content="Welcome to Statpad, the ultimate resource for stat padding through graphs, simulations, confidence intervals, and much more!" />
      <meta property="og:title" content="The Ultimate Tool for Stat Padding" />
      <meta property="og:url" content="https://statpad.vercel.app/" />
      <meta property="og:image" content="https://res.cloudinary.com/dqtpxyaeo/image/upload/v1594509485/webpage/k72yxqcaxwmxpsh252xl.png" />
      <meta property="og:type" content="website" />
      <meta property="og:description" content="Welcome to Statpad, the ultimate resource for stat padding through graphs, simulations, confidence intervals, and much more!" />
      <link rel="icon" type="image/png" href="https://res.cloudinary.com/dqtpxyaeo/image/upload/v1594509878/webpage/kbe7kwyavz3ye7fxamnl.png" />
      <link rel="canonical" href="https://statpad.vercel.app/" /> 
    </Head>
    <div className={classes.root}>
      <Header loggedIn={loggedIn} user={user} />
      <Grid container justify="center">
        <Grid item xs={12} sm={8}>
          <Box textAlign="center" mb={2}>
            <Typography variant="h1" className={classes.title}>
              STATPAD
            </Typography>
          </Box>
          <Box textAlign="center" mb={2}>
            <Typography variant="h3" className={classes.subTitle}>
              The Ultimate Tool for
            </Typography>
          </Box>
          <Box height={100}>
            <InfoCarousel />
          </Box>
        </Grid>
      </Grid>
      <Grid container spacing={3} alignItems="stretch">
        <Grid item xs={12} sm={6}>
          <Card className={classes.card}>
            <Grid item style={{flexGrow: 1}}>
              <Box px={3} mt={3}>
                <Typography variant="h4" className={classes.textWhite}>
                  <span style={{color: 'hsl(46, 72%, 54%)'}}><DonutLargeIcon /></span> Basic Create
                </Typography>
              </Box>
              <hr style={{backgroundColor: '#fff', width: '95%'}} />
              <Box px={3} mt={3}>
                <Typography variant="h6" className={classes.textWhite}>
                  Features:
                </Typography>
                <Box mt={2}>
                  <ul className={classes.descList}>
                    <li>
                      <Typography variant="body1" className={classes.textWhite}>
                        Data Table
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="body1" className={classes.textWhite}>
                        Plots for your data
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="body1" className={classes.textWhite}>
                        Regressions
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="body1" className={classes.textWhite}>
                        1 Var Stats
                      </Typography>
                    </li>
                  </ul>
                </Box>
              </Box>
            </Grid>
            <Grid item>
              <Box px={3}>
                <Button variant="contained" className={classes.successBtn}>
                  <Link href="/create">
                    <a style={{textDecoration: 'none', color: 'inherit'}}>
                      Start Graphing!
                    </a>
                  </Link>
                </Button>
              </Box>
            </Grid>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card className={classes.card}>
            <Grid item style={{flexGrow: 1}}>
              <Box px={3} mt={3}>
                  <Typography variant="h4" className={classes.textWhite}>
                    <span style={{color: 'hsl(283, 87%, 44%)'}}><GpsFixedIcon /></span> Full Version
                  </Typography>
              </Box>
              <hr style={{backgroundColor: '#fff', width: '95%'}} />
              <Box px={3} mt={3}>
                <Typography variant="h6" className={classes.textWhite}>
                  Features:
                </Typography>
                <Box mt={2}>
                  <ul className={classes.descList}>
                    <li>
                      <Typography variant="body1" className={classes.textWhite}>
                        Everything included in Basic Create
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="body1" className={classes.textWhite}>
                        Simulations &amp; Probability
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="body1" className={classes.textWhite}>
                        Confidence Intervals
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="body1" className={classes.textWhite}>
                        Hypothesis Tests
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="body1" className={classes.textWhite}>
                        Save Your Projects
                      </Typography>
                    </li>
                  </ul>
                </Box>
              </Box>
            </Grid>
            <Grid item>
              <Box px={3}>
                <Button variant="contained" className={classes.successBtn}>
                  <Link href="/signup">
                    <a style={{textDecoration: 'none', color: 'inherit'}}>
                      Create an Account!
                    </a>
                  </Link>
                </Button>
              </Box>
            </Grid>
          </Card>
        </Grid>
      </Grid>
    </div>
    </>
  )
}

export const getServerSideProps:GetServerSideProps = async (ctx:GetServerSidePropsContext) => {
  const isAuth = await authenticated(ctx)
  const user = isAuth ? await getUser(ctx) : null
  return {props: {loggedIn: isAuth, user}}
}
