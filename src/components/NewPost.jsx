import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";

const NewPost = ({ image }) => {
    // pass the fake URL to image
    const { url, width, height } = image;

    const [faces, setFaces] = useState([]);
    const [friends, setFriends] = useState([]);
  
    // the reference = get Element by Id
    const imgRef = useRef();
    const canvasRef = useRef();
  
    const handleImage = async () => {
      const detections = await faceapi.detectAllFaces(
        imgRef.current,
        new faceapi.TinyFaceDetectorOptions()
      );
    //   get faces then map through this array and set values to face.box
      setFaces(detections.map((d) => Object.values(d.box)));
    };
  
    const enter = () => {
      const ctx = canvasRef.current.getContext("2d");
      ctx.lineWidth = 5;
      ctx.strokeStyle = "yellow";
      faces.map((face) => ctx.strokeRect(...face));
    };
  

    // Load the face API Model detections
    useEffect(() => {
      const loadModels = () => {
        Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
          faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
          faceapi.nets.faceExpressionNet.loadFromUri("/models"),
        ])
          .then(handleImage)
          .catch((e) => console.log(e));
      };
  
      imgRef.current && loadModels();
    }, []);


  
    const addFriend = (e) => {
      setFriends((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };
  
    console.log(friends);
    return (
      <div className="container">
        <div className="left" style={{ width, height }}>
          <img ref={imgRef} crossOrigin="anonymous" src={url} alt="" />
          <canvas
        //   on hover draw a box 
            onMouseEnter={enter}
            ref={canvasRef}
            width={width}
            height={height}
          />
          
          {/* map through the faces using index then tag a friend */}
          {faces.map((face, i) => (
            <input
              name={`input${i}`}
              style={{ left: face[0], top: face[1] + face[3] + 5 }}
              placeholder="Tag a friend"
              key={i}
              className="friendInput"
              onChange={addFriend}
            />
          ))}
        </div>
        <div className="right">
          <h1>Share your post</h1>
          <input
            type="text"
            placeholder="What's on your mind?"
            className="rightInput"
          />
          {friends && (
            <span className="friends">
              with <span className="name">{Object.values(friends) + " "}</span>
            </span>
          )}
          <button className="rightButton">Send</button>
        </div>
      </div>
    );
  };
  
  export default NewPost;