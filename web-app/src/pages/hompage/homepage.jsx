import { Component, Fragment, useState, useEffect, useCallback } from "react";
import { useHttpClient } from "../../hooks/httpHook";
import { Container, Button, Dropdown, DropdownButton, Pagination, Card } from "react-bootstrap";
import videoGameImage from "../../assets/VideoGameBannerWithBg.png";

import Tweets from "../../components/renderTweets/renderTweets";

import classes from "./homepage.module.css";

function Homepage() {

    // config
    const core_name = "CZ4034";
    const contentField = "rawContent";
    const numLikes = "likeCount";
    const stopWordList = ['a','an','and','are','as','at','be','but','by','for','if','in','into',
                          'is','it','no','not','of','on','or','such','that','the','their','then',
                          'there','these','they','this','to','was','will','with' 
                        ];

    // hook 
    const { sendRequest } = useHttpClient();

    // forms
    const [query, setQuery] = useState(null);
    const [haveNotQueried, setHaveNotQueried] = useState(true);
    const [timeFilter, setTimeFilter] = useState('Time');
    const [sentiFilter, setSentiFilter] = useState('Sentiment');
    const [gameFilter, setGameFilter] = useState('Game');
    const [likesFilter, setLikesFilter] = useState('Likes');

    // filters submission
    const [likes, setLikes] = useState(null);
    const [games, setGames] = useState(null);
    const [labels, setLabels] = useState(null);
    const [time, setTime] = useState(null);

    // response
    const [queryResponse, setQueryResponse] = useState(null);
    const [spellCheck, setSpellCheck] = useState(null);
    const [showSuggestion, setShowSuggestion] = useState(false);
    const [suggestions, setSuggestions] = useState(null);
    const [response, setResponse] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSpellLoading, setIsSpellLoading] = useState(false);
    const [spellResponse, setSpellResponse] = useState(null);
    const [correctSpelling, setCorrectSpelling] = useState(true);

    // pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage] = useState(10);
    const [start, setStart] = useState(0);
    const nPages = queryResponse && queryResponse.docs != '' ? Math.ceil(queryResponse.numFound / recordsPerPage) : 0;
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const pageNumbers = [...Array(nPages + 1).keys()].slice(1);
    const sort = 'likeCount desc';
    
    useEffect(() => {
        setStates();
        setIsLoading(false);
    }, [isLoading]);

    // useEffect(() => {

    // }, [spellResponse]);

    const fetchResponse = async (page) => {
        setSuggestions(null);
        // console.log(page);

        let queryStr = "q=" + contentField + ":(" + query.trim().replace(/\s/g, " AND ") + ")";
        
        if(games) {
            queryStr = queryStr + `&fq=game:(${games})`;
        }

        if(labels) {
            if (labels == -1)
                queryStr += `&fq=final_class:\\${labels}`
            else
                queryStr = queryStr + `&fq=final_class:${labels}`;
        }

        // if(likes != null) {
        //     queryStr = queryStr + "&sort=" + likes; 
        // }

        if (likes != null && time != null) {
            queryStr += `&sort=${likes}, ${time}`; 
        } else if (likes != null) {
            queryStr += `&sort=${likes}`; 
        } else if (time != null) {
            queryStr += `&sort=${time}`; 
        }

        queryStr = queryStr + "&start=" + (page-1)*recordsPerPage + "&rows=" + recordsPerPage;
        
        // console.log(queryStr);

        let url = "http://127.0.0.1:8983/solr/" + core_name + "/select";
        // let body = JSON.stringify({
        //     query: contentField + ":" + query,
        // });
        url = url + "?" + queryStr;
        // console.log(url);
        let method = "POST";
        let headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        };

        const response = await sendRequest(url, method, headers);
        setResponse(response);
        // console.log(response);
        // console.log("no docs:" + response.response.numFound);
        return;
    }

    const fetchSpellCheck = async (word) => {
        setSuggestions(null);
        setSpellStates(null)
        let url = "http://127.0.0.1:8983/solr/" + core_name + "/spell";

        let queryStr = "q=" + contentField + ":(" + word + ")";

        url += "?" + queryStr;

        let method = "POST";
        let headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        };

        const response = await sendRequest(url, method, headers);
        return response;
        // setSpellResponse(response);
        // console.log(`resp in ${word}`);
        // console.log('spell check:' + response.spellcheck.correctlySpelled);
        // console.log(response.spellcheck);
    }

    const setSpellStates = async (words) => {
        let items = null;
        if (spellResponse) {
            setSpellCheck(spellResponse.spellcheck);
            if(spellResponse && !spellResponse.spellcheck.correctlySpelled) {
                items = renderSpellingSuggestion(words);
            }
            
        }
        return items;
    }

    const setStates = async () => {
        if (response) {
            setHaveNotQueried(false);
            setQueryResponse(response.response);
            // console.log(queryResponse);
            calculateCurrentStart();
        }
        let words = null;
        let isSpellCheck = false;
        let items = [];
        let suggestion = "";
        let isPQIdentical = false;
        // if num_docs < 10
        if (response && response.response.numFound < 5) {
            // perform spell check on each query term
            isSpellCheck = true;
            words = query.trim().split(" ");
            if (words.length == 1) {
                let resp = await fetchSpellCheck(words[0]);
                // setIsSpellLoading(true);
                // setSpellCheck(spellResponse.spellcheck);
                if(resp && resp.spellcheck && !resp.spellcheck.correctlySpelled) {
                    items = renderSpellingSuggestion(words, resp.spellcheck);
                }

            } else {
                for(let i=0; i < words.length; i++){
                    if(words[i] !== " ") {
                        if (stopWordList.includes(words[i])) {
                            suggestion += ` ${words[i]}`;
                            continue;
                        }
                        let resp = await fetchSpellCheck(words[i]);
                        // console.log("this is a resp:");
                        // console.log(resp);
                        setIsSpellLoading(true);

                        let wordToAdd = null;
                        // setSpellCheck(spellResponse.spellcheck);
                        if(resp && resp.spellcheck && !resp.spellcheck.correctlySpelled) {
                            wordToAdd = renderSpellingSuggestion(words, resp.spellcheck);
                            console.log(`in ${words[i]}: ${wordToAdd}`);
                            if (wordToAdd != null) {
                                suggestion += ` ${wordToAdd}`;
                            } else {
                                suggestion += ` ${words[i]}`;
                            }
                        } else {
                            suggestion += ` ${words[i]}`;
                        }
                            
                    }
                }
                items.push({"word": suggestion.trim()});
            }
            // console.log(items);
            
            if (suggestion.trim() == query.trim() || !items || items.length == 0) 
                isPQIdentical = true;

            setSuggestions(items);
        } else {
            setSpellCheck(null);
        }

        if (isSpellCheck) {
            if (query != null && query != "" && !isPQIdentical) {
                setShowSuggestion(true);
            } else {
                setShowSuggestion(false);
            };
        }
        return;
    }

    const renderSpellingSuggestion = (words, spellCheckTest) => {
            // sort in descending freq
            let items = [];
            let sortedSuggestions = null;

            if (!words) return null;

            if (words.length == 1) {
                sortedSuggestions = spellCheckTest.suggestions ? spellCheckTest.suggestions[1] ? spellCheckTest.suggestions[1].suggestion.sort((a, b) => a.freq - b.freq) : null : null;
                if (sortedSuggestions == null || sortedSuggestions.length == 0) {
                    setSuggestions(null);
                    return;
                } 
                sortedSuggestions = sortedSuggestions ? sortedSuggestions.splice(sortedSuggestions.length - 2) : [];
                // console.log(sortedSuggestions);
                sortedSuggestions.map((d) => {
                    items.push(d);
                })
                // setSuggestions(items);
                return items;
            } else {
                sortedSuggestions = spellCheckTest.suggestions ? spellCheckTest.suggestions[1] ? spellCheckTest.suggestions[1].suggestion.sort((a, b) => a.freq - b.freq) : null : null;
                if (sortedSuggestions == null || sortedSuggestions.length == 0) {
                    return sortedSuggestions;
                } 

                sortedSuggestions = sortedSuggestions ? sortedSuggestions.splice(sortedSuggestions.length - 1) : [];
                // console.log(sortedSuggestions[0]['word']);
                return sortedSuggestions[0]['word'];

            }

    }

    const nextPage = () => {
        if (currentPage !== nPages) {
            setCurrentPage(currentPage + 1);
            handleSubmit(currentPage + 1);
            return;
        }
        handleSubmit(nPages);
            
    }

    const prevPage = () => {
        if (currentPage !== 1) {
            setCurrentPage(currentPage - 1);
            handleSubmit(currentPage - 1);
            return;
        }
        handleSubmit(1);
        
    }

    const firstPage = () => {
        setCurrentPage(pageNumbers[0]);
        handleSubmit(pageNumbers[0]);
    }

    const lastPage = () => {
        setCurrentPage(pageNumbers[pageNumbers.length - 1]);
        handleSubmit(pageNumbers[pageNumbers.length - 1]);
    }

    const handlePage = (page) => {
        setCurrentPage(page);
        handleSubmit(page);
    }

    const handleSearchField = (e) => {
        e.preventDefault();
        setQuery(e.target.value);
    }

    const handleSubmit = async (page) => {
        if(query == "" || query == null) {
            setQueryResponse(null);
            return;
        }
        // console.log(start);     
        await fetchResponse(page);
        setIsLoading(true);
    }

    const Filters = () => {
        return (
            <Container className={classes.filter}>
                <p style={{ marginTop: '15px' }}>Filters:</p>
                <DropdownButton
                    id="time"
                    variant="outline-light"
                    menuVariant="dark"
                    title={timeFilter}
                    className="mt-2"
                    style={{ marginLeft: '15px' }}
                >
                    <Dropdown.Item  onClick={() => { setTimeFilter("Time") }} >
                        Time
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={() => { setTimeFilter("Most recent"); setTime('date desc') }}>Most recent</Dropdown.Item>
                    <Dropdown.Item  onClick={() => { setTimeFilter("Least recent"); setTime('date asc') }}>Least recent</Dropdown.Item>
                </DropdownButton>

                <DropdownButton
                    id="sentiment"
                    variant="outline-light"
                    menuVariant="dark"
                    title={sentiFilter}
                    className="mt-2"
                    style={{ marginLeft: '15px', marginBottom: '5px' }}
                >
                    <Dropdown.Item onClick={() => { setSentiFilter("Sentiment"); setCurrentPage(null); setLabels(null) }} >
                        Sentiment
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={() => { setSentiFilter("Negative"); setLabels("-1.0") }}>Negative</Dropdown.Item>
                    <Dropdown.Item onClick={() => { setSentiFilter("Neutral"); setLabels("0.0") }}>Neutral</Dropdown.Item>
                    <Dropdown.Item onClick={() => { setSentiFilter("Positive"); setLabels("1.0") }}>Positive</Dropdown.Item>
                </DropdownButton>

                <DropdownButton
                    id="game"
                    variant="outline-light"
                    menuVariant="dark"
                    title={gameFilter}
                    className="mt-2"
                    style={{ marginLeft: '15px', marginBottom: '5px' }}
                >
                    <Dropdown.Item onClick={() => { setGameFilter("Game"); setGames(null) }} >
                        Game
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={() => { setGameFilter("Hogwarts Legacy"); setGames("HGL") }}>Hogwarts Legacy</Dropdown.Item>
                    <Dropdown.Item onClick={() => { setGameFilter("God of War"); setGames("GOW") }}>God of War</Dropdown.Item>
                    <Dropdown.Item onClick={() => { setGameFilter("Stardew Valley"); setGames("Stardew")}}>Stardew Valley</Dropdown.Item>
                    <Dropdown.Item onClick={() => { setGameFilter("Elden Ring"); setGames("ELR")}}>Elden Ring</Dropdown.Item>
                    <Dropdown.Item onClick={() => { setGameFilter("Cyberpunk 2077"); setGames("Cyberpunk")}}>Cyberpunk 2077</Dropdown.Item>
                    <Dropdown.Item onClick={() => { setGameFilter("Monster Hunter World"); setGames("MHW")}}>Monster Hunter World</Dropdown.Item>
                </DropdownButton>

                <DropdownButton
                    id="likes"
                    variant="outline-light"
                    menuVariant="dark"
                    title={likesFilter}
                    className="mt-2"
                    style={{ marginLeft: '15px' }}
                >
                    <Dropdown.Item onClick={() => { setLikesFilter("Likes"); setLikes(null) }} >
                        Likes
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={() => { setLikesFilter("Most Likes"); setLikes(numLikes+" desc") }}>Most Likes</Dropdown.Item>
                    <Dropdown.Item onClick={() => { setLikesFilter("Least Likes"); setLikes(numLikes+" asc") }}>Least Likes</Dropdown.Item>
                </DropdownButton>

            </Container>
        );
    }

    const calculateCurrentStart = () => {
        if (queryResponse && !haveNotQueried)
            setStart((currentPage - 1) * recordsPerPage + 
                queryResponse.docs.length);
    }

    return (
        <Container>
            <Container className={classes.imageContainer}>
                <img src={videoGameImage} className={classes.image} />
            </Container>
            <Container className={classes.searchbar}>
                <input onChange={handleSearchField} className="form-control form-control-lg" placeholder="e.g. Elden Ring" style={{ width: '530px', marginLeft: '90px' }}></input>
                <Button variant="secondary" onClick={()=>{setCurrentPage(1); handleSubmit(1)}} style={{ marginLeft: '15px', height: "40px", marginTop: '5px' }}>Search</Button>
            </Container>

            {showSuggestion && suggestions ?
                <Container className={classes.spellSuggestion}>
                    <p style={{ width: "max-content", marginRight: '200px', position: "absolute" }}>Did you mean: </p>
                    <Container className={classes.spellings}>
                        {suggestions ? suggestions.map((d) => {
                            return (
                                <p style={{ marginLeft: '8px' }}>{d.word}</p>
                            );
                        }) : null}
                    </Container>
                </Container> : null
            }

            <Filters />

            { haveNotQueried ? null : queryResponse && queryResponse.numFound > 0 ?
                <Container className={classes.listnum}>
                    <p style={{ fontWeight: 'bold', marginLeft: '70px'}}> Tweets found: {queryResponse.numFound}</p>
                    <p className={classes.listnum2} style={{ fontWeight: 'bold' }}> Displaying {start} of {queryResponse.numFound} results </p>
                </Container>
                : <Container className={classes.listnum}> 
                    <p style={{ fontWeight: 'bold', marginLeft: '70px'}}> Tweets found: 0 </p> 
                    <p className={classes.listnum2} style={{ fontWeight: 'bold' }}> Displaying 0 of 0 results </p>
                  </Container>
            }

            { haveNotQueried ? null : queryResponse == null || queryResponse.numFound == 0 ? 
                <Container className={classes.card}>
                    <Card className={classes.card2}>
                        <Card.Body>
                            <Card.Title> Oops no tweets were found! </Card.Title>
                            <hr />
                            <Card.Subtitle className="mb-2"> Please try again! </Card.Subtitle>
                        </Card.Body> 
                    </Card>
                </Container> :
                queryResponse.docs.map((tweets) => (
                    <Container className={classes.card}>
                        <Tweets data={tweets} />
                    </Container>
                ))
            }

            <Container className={classes.pagination}>
                { queryResponse && queryResponse.numFound > 0 ? 
                    <Pagination
                        nPages={nPages}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}>
                        <Pagination.First
                            style={{color:"white"}}
                            onClick={firstPage}/>

                        <Pagination.Prev
                            onClick={prevPage} />

                        {pageNumbers.map((pgNumber) => {
                            let state = currentPage == pgNumber ? true : false;
                            if (pgNumber == 4) return <Pagination.Ellipsis />;
                            if (pgNumber < 4 || pageNumbers.slice(-3).some((e) => e <= pgNumber))
                                return <Pagination.Item active={state} 
                                            onClick={() => { 
                                                handlePage(pgNumber); 
                                            }
                                        } > {pgNumber} </Pagination.Item>
                        })}

                        <Pagination.Next 
                            onClick={nextPage} />
                        <Pagination.Last
                            onClick={lastPage} />
                    </Pagination> : null
                }
            </Container>
        </Container>
    );
}

export default Homepage;