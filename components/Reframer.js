'use client';
import { useState } from "react";

export default function Reframer() {
  const [ramble, setRamble] = useState('');
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');

  const fetchResponse = async () => {
    try {
      const API_URL = process.env.NODE_ENV === 'production'
      ? 'https://reframer-473c134b8246.herokuapp.com'.replace(/\/$/, '')
      : 'https://reframer-473c134b8246.herokuapp.com'.replace(/\/$/, '');

      const res = await fetch(`${API_URL}/growthmindset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
        credentials: 'include',
      })

      if (res.ok) {
        const data = await res.json();
         setResponse(data.completion);
      } else {
        console.log('Error', res.status)
      }

    } catch (error) {
      console.log('Error fetching response :',error);
    }
  };

  const handleThoughts = (e) => {
    const thought = e.target.value;
    setPrompt(thought);
  }

  const handleClick = async (e) => {
    e.preventDefault();

    if (prompt.trim()!== '') {
      await fetchResponse();
    }
  };

  return (
    <>
      <div className="reframer-box">
        <p className="intro-text">Turn negative thoughts into</p>
        <p className="intro-text">fuel for growth!</p>
        <input className="reframer-input" value={prompt} placeholder="Your thoughts" onChange={handleThoughts}>
        </input>
        
        <br />
        
        <button className="reframer-submit" type="reframer-submit" onClick={handleClick}>Reframer</button>

         <div className="reframer-output">
            {response && <h3>{response}</h3>}
          </div>
      </div>
    </>
  );
}
