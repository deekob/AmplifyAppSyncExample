import React, { Component } from 'react';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import Typography from '@material-ui/core/Typography';

const styles = createStyles({
    card: {
        maxWidth: 600
    },
    media: {
        height: 250
    }
});

interface State {
    autorefresh: boolean
}

interface Props extends WithStyles<typeof styles> {
    media: JSX.Element,
    value: number,
    onAutoRefresh: (autorefresh: boolean) => void
}

class MediaCard extends Component<Props, State> {
    state = {
        autorefresh: false
    }

    constructor(props: Props) {
        super(props);
        this.onAutoRefresh = this.onAutoRefresh.bind(this);
    }

    onAutoRefresh() {
        this.setState({
            autorefresh: !this.state.autorefresh
        });
        this.props.onAutoRefresh(!this.state.autorefresh);
    }

    render() {
        const { classes, media, value } = this.props;
        return (
            <Card className={classes.card}>
                <CardActionArea>
                    <FormGroup>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={this.state.autorefresh}
                                    onChange={this.onAutoRefresh}
                                    aria-label="AutoRefreshSwitch" />
                            }
                            label="Auto Refresh"
                        />
                    </FormGroup>
                    <CardMedia
                        src={"null"}
                        className={classes.media}>
                            {media}    
                    </CardMedia>
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                            Valuation
                        </Typography>
                        <Typography component="p">
                            { value }
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
        )
    }
}

export default withStyles(styles)(MediaCard);