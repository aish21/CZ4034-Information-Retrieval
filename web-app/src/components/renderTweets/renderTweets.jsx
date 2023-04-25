import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import Card from 'react-bootstrap/Card';

import classes from "./renderTweets.module.css";

import { AiOutlineClockCircle, AiOutlineLike, AiOutlineUser } from "react-icons/ai";
import { MdSentimentSatisfiedAlt, MdSentimentDissatisfied, MdSentimentNeutral } from "react-icons/md";
import Badge from 'react-bootstrap/Badge'

const Tweets = (props) => {

    const {
        rawContent,
        hashtags,
        likeCount,
        retweetCount,
        replyCount,
        url,
        _username,
        followersCount,
        date,
        final_class,
        game,
    } = props.data 
    
    // let navigate = useNavigate(); 

    return (
        <Card className={classes.card}>
            <Card.Body>
                <Card.Title> {<AiOutlineUser style={{marginBottom: "5px"}}/>} {_username}   
                {<Badge style={{marginLeft: "10px"}}bg="secondary">
                    {game}
                </Badge>}
                </Card.Title>
                

                <hr />
                <Card.Subtitle className="mb-2"> {rawContent}</Card.Subtitle>
                <Container className={classes.alignment}>
                    <Card.Subtitle style={{ marginLeft:'-10px'}}> {<AiOutlineClockCircle style={{marginBottom: "3px"}}/>} {date} </Card.Subtitle>
                    <Card.Subtitle style={{ marginLeft:'10px'}}> { <AiOutlineLike style={{marginBottom: "5px"}}/> } {likeCount} </Card.Subtitle>
                    
                </Container>
                { final_class ? final_class[0] == 1 ? 
                        <Card.Subtitle style={{ marginLeft:'700px', position:"absolute", marginTop: "-20px"}}> { <MdSentimentSatisfiedAlt size = {40} /> } </Card.Subtitle> 
                        : final_class[0] == -1 ?
                        <Card.Subtitle style={{ marginLeft:'700px', position:"absolute", marginTop: "-20px"}}> { <MdSentimentDissatisfied size = {40} /> } </Card.Subtitle> 
                        : <Card.Subtitle style={{ marginLeft:'700px', position:"absolute", marginTop: "-20px"}}> { <MdSentimentNeutral size = {40} /> } </Card.Subtitle> 
                        : null
                    }
                
            </Card.Body> 
            
        </Card> 
    );
}
export default Tweets;