import React, { Component } from 'react';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';

type State = {
    auth: boolean,
    anchorEl: string | undefined
};

const styles = createStyles({
    root: {
        flexGrow: 1
    },
    grow: {
        flowGrow: 1
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20
    }
});

class MenuAppBar extends Component<WithStyles<typeof styles>, State> {
    state = {
        auth: false,
        anchorEl: undefined
    }

    handleChange = (evt: any) => {
        this.setState({ auth: evt.target.checked });
    }

    handleMenu = (evt: any) => {
        this.setState({ anchorEl: evt.currentTarget });
    }

    handleClose = () => {
        this.setState({ anchorEl: undefined });
    }

    render() {
        const { classes } = this.props;
        const { anchorEl } = this.state;
        const open = Boolean(anchorEl);

        return (
            <div className={classes.root}>
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h6" color="inherit" className={classes.grow}>
                            Stocks Lounge
                        </Typography>
                        <div>
                            <IconButton 
                                aria-owns={open ? 'menu-appbar' : undefined }
                                aria-haspopup="true"
                                onClick={this.handleMenu}
                                color="inherit"
                            >
                                <AccountCircle />
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right'
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right'
                                }}
                                open={open}
                                onClose={this.handleClose}
                            >
                                <MenuItem onClick={this.handleClose}>Logout</MenuItem>
                            </Menu>
                        </div>
                    </Toolbar>
                </AppBar>
            </div>
        )
    }
}

export default withStyles(styles)(MenuAppBar);