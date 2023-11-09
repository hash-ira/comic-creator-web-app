import React, { useState } from "react";
import "./../Styles/input.css"

function Input(props) {

  const {imgArr , setImgArr} = props;
  const currIdx = 0;

  const [inputText, setInputText] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  //handling setImgArray
  function changeState(textInput , imageBlobURL){

    //remove prev state
    setImgArr( imgArr.filter(ele => {
      return ele.id != currIdx;
    }));

    //adding new state
    setImgArr( (prev) => {
      return [
        ...prev,
        {
          id : currIdx,
          ImgURL: imageBlobURL,
          text: textInput
        }
      ]
    });

    //sorting the array
    setImgArr((prev) => prev.sort((a , b) => a.id - b.id))
  }

  console.log(imgArr);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission
    const textInput = e.target.value;

    try {
      const response = await fetch('https://xdwvg9no7pefghrn.us-east-1.aws.endpoints.huggingface.cloud', {
        method: 'POST',
        headers: {
          'Accept': 'image/png',
          'Authorization': 'Bearer VknySbLLTUjbxXAXCjyfaFIPwUTCeRXbFSOjwRiCxsxFyhbnGjSFalPKrpvvDAaPVzWEevPljilLVDBiTzfIbWFdxOkYJxnOPoHhkkVGzAknaOulWggusSFewzpqsNWM', // Include your Bearer token
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "inputs": inputText }),
      });

      if (response.ok) {

        const imageBlob = await response.blob();
        let imageBlobURL = URL.createObjectURL(imageBlob);
        changeState(textInput , imageBlobURL);

        console.log(imageBlobURL);
        setErrorMessage(''); // Clear any previous error message

      } else if (response.status === 401) {
        setErrorMessage('Authentication failed. Please check your Bearer token.');
        changeState(textInput , ""); // Clear the image URL
      } else {
        setErrorMessage('An error occurred. Please try again later.');
        changeState(textInput , ""); // Clear the image URL
      }
    } catch (error) {
      console.error('Request error:', error);
      setErrorMessage('An error occurred. Please try again later.');
      changeState(textInput , "");; // Clear the image URL
    }
  };

  return (
    <div className="form-container">
      <input
        className="form-input"
        type="text"
        placeholder="Enter promt for scene 1"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />
      <button className="form-button" onClick={handleSubmit}>Search</button>
    </div>
  );
}

export default Input;
