import React, { useState , useEffect} from 'react';
import abi from "./utils/poll.json";
import { ethers } from "ethers";
import Loader from './Loader';

function App() {

  const [currentAccount, setCurrentAccount] = useState('');
  const [name, setName] = useState('');
  const [allCandidates, setAllCandidates] = useState([]);
  const [totalVotes, setTotalVotes] = useState('');
  const [votes, setVotes] = useState([]);
  const [isLoading, setIsLoading] = useState();

  const contractAddress = "0xe73aaa13eE3e391A50b0B46AE139F7D1A8e259CD";
  const contractABI = abi.abi;

  const checkIfWalletIsConnected = async () => {
    try{
     const { ethereum } = window;
 
     if (!ethereum) {
       console.log("Make sure you have metamask!");
     } else {
       console.log("We have the ethereum object");
     }
 
     const accounts = await ethereum.request({ method: "eth_accounts" });
 
     if (accounts.length !== 0){
       const account=accounts[0];
       console.log("Found an authorized account:");
       setCurrentAccount(account);
       getAllCandidates();
       getAllvotes();
       getVotes();
     }else{
       console.log("No authorized account found");
     }
    }catch(error){
       console.log(error);
    }
  }

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
      document.location.reload(true);
    } catch (error) {
      console.log(error)
    }
  }

  const onInputChange = (e) => {
    const {value} = e.target;
    setName(value);
  };

  const addCandidate = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const pollContract = new ethers.Contract(contractAddress, contractABI, signer);

        const candidate = await pollContract.addToCandidates(name);
        setIsLoading(true);
        console.log("mining...", candidate.hash);
        await candidate.wait();
        console.log("mined..",candidate.hash);
        setIsLoading(false);
        window.location.reload();
      }else{
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const vote = async (index) => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const pollContract = new ethers.Contract(contractAddress, contractABI, signer);

        const voteTxn = await pollContract.vote(index);
        setIsLoading(true);
        console.log("mining...", voteTxn.hash);
        await voteTxn.wait();
        console.log("mined..",voteTxn.hash);
        setIsLoading(false);

      }else{
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
        console.log(error);
        alert(error);
    }
  }
  
  const getAllCandidates = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const pollContract = new ethers.Contract(contractAddress, contractABI, signer);

        const candidates = await pollContract.getAllCandidates();
        let candidatesCleaned = [];
        candidates.forEach(candidate => {
          candidatesCleaned.push({
            candidate_id: candidate.id,
            candidate_name: candidate.name,
          });
        });

        setAllCandidates(candidatesCleaned);
        console.log(candidatesCleaned);
      }else{
        console.log("Ethereum object doesn't exist!");
      }
    }catch(error){
      console.log(error);
    }
  }

  const getVotes = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const pollContract = new ethers.Contract(contractAddress, contractABI, signer);

        const votes = await pollContract.getVotes();
        let votesCleaned = [];
        votes.forEach(vote => {
          votesCleaned.push({
            no_votes: vote,
          });
        });
        setVotes(votesCleaned);
        console.log(votesCleaned);
      }else{
        console.log("Ethereum object doesn't exist!");
      }
    }catch(error){
      console.log(error);
    }
  }

  const getAllvotes = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const pollContract = new ethers.Contract(contractAddress, contractABI, signer);

        const votes = await pollContract.getAllVotes();
        const Votes = votes.toNumber();
        setTotalVotes(Votes);
      }else{
        console.log("Ethereum object doesn't exist!");
      }
    }catch(error){
      console.log(error);
    }
  }


useEffect(() => {
  checkIfWalletIsConnected();
}, [])

  return (
    <div >
    <div className='flex justify-between'>
       <div className='text-white mx-5 my-10 font-bold text-2xl h-2 '>
         ELECTION 2022
       </div>
       <div className='mr-6'>
       {!currentAccount && (
          <button className='bg-blue-900 rounded-lg h-10 w-40 my-10' onClick={connectWallet}>
            Connect Wallet
          </button>
        )}</div>
    </div>
    <hr className='-mt-5'></hr>
    <div className='container'>
      <div>
        <div className='text-white text-2xl my-10 mx-5'>Candidates</div>
        <div className='flex border border-blue-800 h-28 w-90 mx-10 -mt-2 px-5'>
          <input className='bg-gray-700 my-9 h-8 rounded-lg' type="text" placeholder="Candidate Name" value={name} onChange={onInputChange}/>
          {isLoading?(<Loader/>):(<button className='h-10 w-20 mx-8 my-8 bg-blue-800 rounded-lg' onClick={addCandidate}>Add</button>)}
          {allCandidates.map((candidate,index) => {
            return(
              <div className='flex m-8 text-lg' key={index}>
                <div className='px-1'>{candidate.candidate_id.toNumber()}.</div>
                <div>{candidate.candidate_name}</div>
              </div>
            )})}
        </div>
      </div>
      </div>
      <div className='container'>
        <div className='text-2xl text-yellow-100 mt-8 mx-5 '>Cast your vote</div>
        <div className='bg-gray-900 rounded-lg shadow-xl'>
          <div>
           {allCandidates.map((candidate,index) => {
                return(
                  <div className='flex justify-around my-6 mx-auto md:p-3 text-lg' key={index}>
                    <div className='px-1'>{candidate.candidate_name}</div>
                    <button className='h-10 w-20 bg-blue-800 rounded-lg' onClick ={()=>{vote(index)}}>VOTE</button>
                  </div>
                )})}
          </div>
        </div>
        </div> 
      <div className='container'>
      <div className='text-2xl text-red-300 mt-8 mx-20 results'>Poll Results :</div>
          <div className='flex gap-20 justify-center my-6 p-1 text-lg'>
          <div>{allCandidates.map((candidate,index) => {
                return(
                      <div className='my-5' key={index}>
                      <div className=''>{candidate.candidate_name}</div>
                    </div>
                )})}</div>
                      <div>{votes.map((vote,index) => {
                        return(
                          <div className='my-5' key={index}>
                            <div>{vote.no_votes.toNumber()}</div>
                          </div>
                        )
                      })}</div>
          </div>
      </div>
      <div className='container'>
      <div className='text-2xl mt-8 mx-20 text-blue-300 votes'>Total votes :</div>
        <div className='text-center p-8 text-2xl'>{totalVotes}</div>
    </div>
  </div>
  )
}

export default App
