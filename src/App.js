import './App.css';
import Post from './Post';
import { useState,useEffect } from 'react';
import { db,auth } from './firebase';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import { Button,Input } from '@material-ui/core';
import ImageUpload from './ImageUpload';
import firebase from 'firebase';
import { googleProvider } from './authmethod'
import socialMediaAuth from './auth';
import image from'./images/googleicon.png'

function getModalStyle() {
  const top = 50 ;
  const left = 50 ;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));


function App() {

  const classes=useStyles();
  const [modalStyle]=useState(getModalStyle);
  const [posts,setPosts]=useState([]);
  const [open,setOpen]=useState(false);
  const [openSignIn,setOpenSignIn]=useState(false);
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [username,setUsername]=useState("");
  const [user,setUser]=useState(null);

  useEffect(()=>{
    const unsubscribe=auth.onAuthStateChanged((authUser)=>{
      if(authUser){
        console.log(authUser)
        setUser(authUser);
        
      }
      else{
            setUser(null);
      }
    })
    return()=>{
      unsubscribe();
    }

  },[user,username]);


  useEffect(() => {
    db.collection('posts').orderBy('timestamp','desc').onSnapshot(snapshot=>{

      setPosts(snapshot.docs.map(doc=>({
        id:doc.id,
        post:doc.data()})))
    })
  }, [])

  const signUp=(event)=>{
    event.preventDefault();
    auth 
        .createUserWithEmailAndPassword(email,password)
        .then((authUser)=>{
         return authUser.user.updateProfile({
            displayName:username
          })
        })
        .catch((error)=>alert(error.message))
    setOpen(false);
    setEmail("");
    setPassword("");
    setUsername("");
  }

  const signIn=(event)=>{
    event.preventDefault();
    auth 
        .signInWithEmailAndPassword(email,password)
        
        .catch((error)=>alert(error.message))
    setOpenSignIn(false);
    setEmail("");
    setPassword("");
  }

 

  useEffect(() => {
    
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        console.log("User signed In")
        console.log(user)

      } else {
        console.log("NoUser signed In")
      }
    });
  
  }, [])

  const handleOnClick=async(provider)=>{
      const res=await socialMediaAuth(provider);
      console.log(res);
  }



  return (
    <div className="App">

     
      <Modal
        open={open}
        onClose={()=>setOpen(false)}
        >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
          <center>
            <img 
            className="app_headerImage"
              src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwebstockreview.net%2Fimages%2Fcooking-clipart-culinary-1.png&f=1&nofb=1"
            />
            </center>
            <Input
              placeholder="username"
              type="text"
              value={username}
              onChange={(e)=>setUsername(e.target.value)}
            />
            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
            />
             <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signUp}>Sign Up</Button>
            </form>
          
    </div>
      
      </Modal>



      <Modal
        open={openSignIn}
        onClose={()=>setOpenSignIn(false)}
        >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
          <center>
            <img 
            className="app_headerImage"
              src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwebstockreview.net%2Fimages%2Fcooking-clipart-culinary-1.png&f=1&nofb=1"
            />
            </center>
            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
            />
             <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
            />
            <Button typr="submit" onClick={signIn}>Sign In</Button>
            </form>
          
    </div>
      
      </Modal>

      


      <div className="app_header">
      
      <img 
        className="app_headerImageone"
        src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwebstockreview.net%2Fimages%2Fcooking-clipart-culinary-1.png&f=1&nofb=1"
        />
      {user ?(
         <div className="app__logincontainer">
           <h3>Hello {user.displayName}</h3>
        <Button onClick={()=>auth.signOut()}>
        Sign Out
      </Button>
      </div>
      ):(

        <div className="app__logincontainer">
      <Button onClick={()=>handleOnClick(googleProvider)}>
        <img src={image} alt=" "/>
       Sign In
      </Button>
      <Button onClick={()=>setOpenSignIn(true)}>
        Sign In
      </Button>
      <Button onClick={()=>setOpen(true)}>
        Sign Up
      </Button>
      </div>
      )}
      </div>
      
      {user?.displayName ? (
        <ImageUpload username={user.displayName} />
      ):(
        <h2><center>Please login to upload</center></h2>
      )}


      <div className="app__posts">
      {
      posts.map(({id,post})=>(
        <Post
          key={id}
          username={post.username}
          caption={post.caption}
          imageUrl={post.imageUrl}
          />
      ))
      } 
      </div>
      


  
    </div>
  );
}

export default App;
