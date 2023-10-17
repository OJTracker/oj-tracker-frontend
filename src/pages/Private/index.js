import { AppBar, Container, Grid } from "@material-ui/core";

import TopBar from "../../components/TopBar";

import classes from './private.module.css';
import Routes from "../../Routes";

const Private = () => {
    return (
        <>
            <div className={classes.root}>
                <AppBar position="fixed">
                    <TopBar private />
                </AppBar>
                <main className={classes.content}>
                    <Container maxWidth="lg">
                        <Grid container style={{"justify-content": "center"}}>
                            <Routes />
                        </Grid>
                    </Container>
                </main>
            </div>
        </>
    )
}

export default Private;
