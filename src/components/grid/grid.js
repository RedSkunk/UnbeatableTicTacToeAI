import React from 'react';
import './grid.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class Grid extends React.Component {

    render() {
        const status = this.props.status;
        let icon = <div></div>;
        let className = "grid";
        if (status === 1) { // player1 circle
            icon = <FontAwesomeIcon className="grid-icon" icon={['far', 'circle']} />;
            className += " player1";
        } else if (status === 2) { // player2 cross
            icon = <FontAwesomeIcon className="grid-icon" icon={['fas', 'times']} />;
            className += " player2";
        }

        return (
            <div className={className}
                onClick={() => this.props.clickedGridHandler(this.props.gridId) }>
                    { icon }
            </div>
        );
    }
}

export default Grid;