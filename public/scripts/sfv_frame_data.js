var Router = window.ReactRouter.Router;
var Route = window.ReactRouter.Route;
var Link = window.ReactRouter.Link;
var browserHistory = window.ReactRouter.browserHistory;

var CharacterList = React.createClass({
    getInitialState: function() {
        return {data: []};
    },

    componentDidMount: function() {
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({data: data});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },

    render: function() {
        var characterNodes = this.state.data.map(function(character, i) {
            return (
                <CharacterLink character={character.character} key={i} />
            );
        });
        return (
            <div>
                <div className="span2">
                    <div className="well sidebar-nav">
                        <ul className="nav nav-list characterList">
                            <li className="nav-header">Characters</li>
                            {characterNodes}
                        </ul>
                    </div>
                </div>
                <div className="span9">
                    <Character data={this.state.data}/>
                </div>
            </div>
        );
    }
});

var CharacterLink = React.createClass({
    getInitialState: function() {
        return {characterName: []};
    },

    componentWillReceiveProps: function() {
        console.log("Checkin");
        var characterName = ''
        if (window.location.pathname.indexOf(this.props.character) > -1) {
            characterName = this.props.character
        }

        this.setState({characterName: characterName});
    },

    render: function() {
        var active = "";
        if (this.props.character === this.state.characterName) {
            active = "active";
        }
        return (
            <li className={active}>
                <Link to={"/" + this.props.character}>{this.props.character}</Link>
            </li>
        );
    }
});

var Character = React.createClass({
    getInitialState: function() {
        return {
            character: ''
        };
    },

    componentWillReceiveProps: function() {
        var characterData = ''
        for (name in this.props.data) {
            if (window.location.pathname.indexOf(this.props.data[name].character) > -1) {
                characterData = this.props.data[name]
                break;
            }
        }

        this.setState({character: characterData});
    },

    componentWillUnmount: function() {
        this.serverRequest.abort();
    },

    render: function() {
        if (this.state.character) {
            var moveNodes = this.state.character.moves.map(function(move, i) {
                return (
                    <Move move={move} key={i}/>
               );
            });
            return (
                <div className="character">
                    <img src={"assets/" + this.state.character.character + ".png"}/>
                    {moveNodes}
                </div>
            );
        }
        else {
            return (
                <div className="character">
                    Select a character
                </div>
            );
        }
    }
});

var Move = React.createClass({
    render: function() {
        var tableStyle = {
            width: '100%'
        };
        return (
            <div className="row-fluid moveName">
                <h4>{this.props.move.name}</h4>
                <div className="row-fluid frameData">
                    <div className="span3 basicData">
                        <p>Basic Data</p>
                        <div className="table-responsive">
                            <table className="table table-condensed table-striped" style={tableStyle}>
                                <tbody>
                                    <tr>
                                        <td>startup</td>
                                        <td>active</td>
                                        <td>recovery</td>
                                        <td>total</td>
                                    </tr>
                                    <tr>
                                        <td>{this.props.move.frameData.basic.startup}</td>
                                        <td>{this.props.move.frameData.basic.active}</td>
                                        <td>{this.props.move.frameData.basic.recovery}</td>
                                        <td>{this.props.move.frameData.basic.total}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="span3 activeData">
                        <p>On Hit</p>
                        <ActiveData activeData={this.props.move.frameData.hit}/>
                    </div>
                    <div className="span3 activeData">
                        <p>On Counterhit</p>
                        <ActiveData activeData={this.props.move.frameData.counter}/>
                    </div>
                    <div className="span3 activeData">
                        <p>On Block</p>
                        <ActiveData activeData={this.props.move.frameData.block}/>
                    </div>
                </div>
            </div>
        );
    }
});

var ActiveData = React.createClass({
    render: function() {
        var tableStyle = {
            width: '100%'
        };
        var advantage = this.props.activeData.advantage;
        var color = "";
        if (advantage < -2) {
            color = "error";
        }
        else if (advantage < 0) {
            color = "warning";
        }
        else {
            color = "success";
        }
        return (
            <div className="table-responsive">
                <table className="table table-condensed table-striped" style={tableStyle}>
                    <tbody>
                        <tr>
                            <td>damage</td>
                            <td>stun</td>
                            <td>advantage</td>
                        </tr>
                        <tr className={color}>
                            <td>{this.props.activeData.damage}</td>
                            <td>{this.props.activeData.stun}</td>
                            <td>{this.props.activeData.advantage}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
});


class Index extends React.Component { 

    constructor(props) {
        super(props);
    }
    render() {
        return (
            <CharacterList url="/api/frame_data"/>
        );
    }
}

ReactDOM.render((
    <Router history={browserHistory}>
        <Route path="/" component={Index}/>
        <Route path="/birdie" component={Index}/>
        <Route path="/bison" component={Index}/>
        <Route path="/cammy" component={Index}/>
        <Route path="/chun-li" component={Index}/>
        <Route path="/dhalsim" component={Index}/>
        <Route path="/fang" component={Index}/>
        <Route path="/karin" component={Index}/>
        <Route path="/ken" component={Index}/>
        <Route path="/laura" component={Index}/>
        <Route path="/mika" component={Index}/>
        <Route path="/nash" component={Index}/>
        <Route path="/necalli" component={Index}/>
        <Route path="/rashid" component={Index}/>
        <Route path="/ryu" component={Index}/>
        <Route path="/vega" component={Index}/>
        <Route path="/zangief" component={Index}/>
    </Router>
), document.getElementById('content'))
