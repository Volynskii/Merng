import React, { useContext, useState, useRef } from 'react';
import gql from 'graphql-tag';
import { useQuery, useMutation } from '@apollo/react-hooks';
import './SinglePost.scss';
import moment from 'moment';
import {
    Button,
    Card,
    Form,
    Grid,
    Image,
    Icon,
    Label
} from 'semantic-ui-react';

import { AuthContext } from '../context/auth';
import LikeButton from '../components/LikeButton';
import DeleteButton from '../components/DeleteButton';

function SinglePost(props) {
    const postId = props.match.params.postId;
    const { user } = useContext(AuthContext);
    const commentInputRef = useRef(null);
    const replyRef = useRef(null);
    const currentReply = replyRef.current;

    const neededValue = currentReply !== null ? currentReply.innerText : null;
    console.log(neededValue)
    const [spanValue,setSpanValue] = useState('');
    console.log(spanValue)
    const [comment, setComment] = useState('');

    const {
        data: { getPost }
    } = useQuery(FETCH_POST_QUERY, {
        pollInterval: 500,
        variables: {
            postId
        }
    });

    const [submitComment] = useMutation(SUBMIT_COMMENT_MUTATION, {
        update() {
            setComment('');
            commentInputRef.current.blur();
        },
        variables: {
            postId,
            body: comment
        }
    });
    const [submitReply] = useMutation(REPLY_COMMENT_MUTATION, {
        update() {
            // setComment('');
            // commentInputRef.current.blur();
        },
        variables: {
            newReply: 'a',
            postId,
            commentId:"60b109a272efc453e47eee49"

        }
    });
    function deletePostCallback() {
        props.history.push('/');
    }
    const [open,setOpen] = useState(false)
    console.log('open?',open)
    let postMarkup;
    if (!getPost) {
        postMarkup = <p>Loading post..</p>;
    } else {
        const {
            id,
            body,
            createdAt,
            username,
            comments,
            likes,
            likeCount,
            commentCount
        } = getPost;

        console.log('comments', comments)
        postMarkup = (
            <Grid>
                <Grid.Row>
                    <Grid.Column width={2}>
                        <Image
                            src="https://react.semantic-ui.com/images/avatar/large/molly.png"
                            size="small"
                            float="right"
                        />
                    </Grid.Column>
                    <Grid.Column width={10}>
                        <Card fluid>
                            <Card.Content>
                                <Card.Header>{username}</Card.Header>
                                <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                                <Card.Description>{body}</Card.Description>
                            </Card.Content>
                            <hr/>
                            <Card.Content extra>
                                <LikeButton user={user} post={{id, likeCount, likes}}/>
                                <Button
                                    as="div"
                                    labelPosition="right"
                                    onClick={() => console.log('Comment on post')}
                                >
                                    <Button basic color="blue">
                                        <Icon name="comments"/>
                                    </Button>
                                    <Label basic color="blue" pointing="left">
                                        {commentCount}
                                    </Label>
                                </Button>
                                {user && user.username === username && (
                                    <DeleteButton postId={id} callback={deletePostCallback}/>
                                )}
                            </Card.Content>
                        </Card>
                        {user && (
                            <Card fluid>
                                <Card.Content>
                                    <p>Post a comment</p>
                                    <Form>
                                        <div className="ui action input fluid">
                                            <input
                                                type="text"
                                                placeholder="Comment.."
                                                name="comment"
                                                value={comment}
                                                onChange={(event) => setComment(event.target.value)}
                                                ref={commentInputRef}
                                            />
                                            <button
                                                type="submit"
                                                className="ui button teal"
                                                disabled={comment.trim() === ''}
                                                onClick={submitComment}
                                            >
                                                Submit
                                            </button>
                                        </div>
                                    </Form>
                                </Card.Content>
                            </Card>
                        )}
                        {comments.map((comment) => (
                            <Card fluid key={comment.id}>
                                <Card.Content>
                                    {user && user.username === comment.username && (
                                        <DeleteButton postId={id} commentId={comment.id}/>
                                    )}
                                    <Card.Header>{comment.username}</Card.Header>
                                    <Card.Meta style={{display: 'flex'}}>
                                        <div>{moment(comment.createdAt).fromNow()}</div>
                                        <button className="reply-button"
                                                onClick={() => setOpen(!open)}>{open ? 'Cancel' : 'Reply'}</button>
                                    </Card.Meta>

                                    <Card.Description>{comment.body}</Card.Description>
                                    {comment.replies && (
                                        comment.replies.map((reply,index) => (
                                            <div key={index}>{reply}</div>
                                        ))
                                    )}
                                    <p style={open ? {} : {display: 'none'}} className="reply-text">Reply
                                        to {comment.username}</p>

                                    <p style={{display: 'flex',alignItems: 'flex-end'}}><span ref={replyRef} className="textarea answer-input" role="textbox"
                                                                                              style={open ? {} : {display: 'none'}}
                                                                                              contentEditable onChange={(event) => setSpanValue('123')} />
                                        <button
                                            style={open ? {} : {display: 'none'}}
                                            type="submit"
                                            className="ui button teal"
                                            // disabled={comment.trim() === ''}
                                            onClick={
                                                (event) => {
                                                    setSpanValue(event.currentTarget.previousElementSibling.textContent)
                                                    submitReply()
                                                }
                                            }

                                            // setSpanValue(event.currentTarget.previousElementSibling.textContent)
                                            // event.currentTarget.previousElementSibling.textContent = ''
                                            // }

                                        >
                                            Submit
                                        </button>
                                    </p>


                                </Card.Content>
                            </Card>
                        ))}
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    }
    return postMarkup;
}

const SUBMIT_COMMENT_MUTATION = gql`
  mutation($postId: String!, $body: String!) {
    createComment(postId: $postId, body: $body) {
      id
      comments {
        id
        body
        createdAt
        username
       replies
      }
      commentCount
    likeCount
    }
  }
`;
const REPLY_COMMENT_MUTATION = gql`
mutation($newReply: String!,$postId: ID!,$commentId: ID!) {
replyComment(newReply:$newReply,postId:$postId,commentId:$commentId) {
id
  }
  }
`
const FETCH_POST_QUERY = gql`
  query($postId: ID!) {
    getPost(postId: $postId) {
      id
      body
      createdAt
      username
      likeCount
      likes {
        username
      }
      commentCount
      comments {
        id
        username
        createdAt
        body
    replies
      }
    }
  }
`;

export default SinglePost;
