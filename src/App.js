import logo from './packet.png';
import './App.css';
import { useEffect } from 'react';
import wall from './wall.png';
import axios from 'axios';
import { useState } from 'react';
import fireimg from './fireimg.png';


function App() {
  const [ipsList, setipsList] = useState([{}])
  const [notblocked,setnotblocked] = useState(true);
  const [logs,setlogs] = useState("Simulation Started");
  
  const reset = ()=>{
      setnotblocked(true);
      setpacketstate(0);
      get_ips_blacklisted();
      setlogs("");
      document.getElementById("logo").style.visibility="visible";
      document.getElementById("packip").style.visibility="visible";
      document.getElementById("packport").style.visibility="visible";
      document.getElementById('ip').value="";
      document.getElementById('port').value="";
      document.getElementById('ip1').value="";
      document.getElementById('port1').value="";
      document.getElementById('ip2').value="";
      document.getElementById('port2').value="";
      update();


  }
  const start = ()=>{
    
    setpacketstate(1);
    get_ips_blacklisted();
    setTimeout( function() { console.log(ipsList);
      ipsList.forEach(check); }, 1000);
      // console.log(notblocked)
    setTimeout(()=>{
      if (notblocked==true){
        document.getElementById("logo").style.visibility="hidden";
        document.getElementById("packip").style.visibility="hidden";
        document.getElementById("packport").style.visibility="hidden";
        
      }
      
    },500)
    fetch_logs();
    
    
    
  }
  const fetch_logs=()=>{
   
    axios.post(`http://localhost:8000/api/ipss/`,{ 'ip': document.getElementById('ip').value, 'port': document.getElementById('port').value })
      .then(res => {
        setlogs(res.data["logs"]);
        // console.log(res.data);
        // console.log(res.data);
        
      })

  }
  const check=(value)=>{
    
    if (value["ip"] && document.getElementById("ip").value ){
      console.log([value["ip"],document.getElementById("ip").value])
      if (value["ip"]==document.getElementById("ip").value){
        console.log([value["ip"],document.getElementById("ip").value])
        // console.log(packetstate);
        setpacketstate(0);
        setnotblocked(false);
        // console.log(notblocked);
        setTimeout( function() { alert("Packet Blocked, In blacklist!!!") }, 1000);
        
        
      }
    }
  }
  
  useEffect(() => {
    axios.get('http://localhost:8000/api/ips/')
      .then(res => {
        setipsList(res.data)
        // console.log(res.data);
        // console.log(res.data);
        
      })
    //   console.log(songsList);
  },[]);
  const get_ips_blacklisted = ()=>{
    axios.get('http://localhost:8000/api/ips/')
      .then(res => {
        
        // console.log(res.data);
        // console.log(res.data);
        // setipsList(res.data);
        // console.log(res.data);
        setipsList(res.data);
        // console.log(ipsList);
        
      })
      
   
  }
  const update = ()=>{
    document.getElementById('packip').innerHTML = "IP: "+document.getElementById('ip').value;
    document.getElementById('packport').innerHTML = "PORT: "+document.getElementById('port').value;
  }

  const whitelist = (title)=>{
    if (document.getElementById('ip1') && document.getElementById('port1')){
      title = document.getElementById('ip1').value;
      // var port = document.getElementById('port1').value.toString();
      axios.delete(`http://localhost:8000/api/ips/${title}`)
      .then(res => console.log(res.data)) 
      alert("Successfully whitelisted");
      document.getElementById('ip1').value="";
      document.getElementById('port1').value="";
      get_ips_blacklisted();
    }
    
  }
  const blacklist = ()=>{
    if (document.getElementById('ip2') && document.getElementById('port2')){
      axios.post('http://localhost:8000/api/ips/', { 'ip': document.getElementById('ip2').value, 'port': document.getElementById('port2').value })
      .then(res => console.log(res))
      alert("Successfully blacklisted");
      
      get_ips_blacklisted();
      document.getElementById('ip2').value="";
      document.getElementById('port2').value="";
    }
    
  }
  
  const [packetstate,setpacketstate] = useState(0);

  return (
    <div className="App">
      <header className="App-header">
        <center><h2>Firewall Simulation</h2></center>
        <br></br>
        <br></br>
        <div style={{display:'flex',justifyContent:'space-evenly',alignItems:'center'}}>
          <div>
          <img src={logo} id="logo" style={{width:'100px'}} className={(packetstate==0)?"leftpacket":"rightpacket"}></img>
          {/* <br></br> */}
          <h4 id='packip' style={{fontSize:'11px',width:'30px'}} className={(packetstate==0)?"leftpacket":"rightpacket"}></h4>
          <h4 id='packport'style={{fontSize:'11px',width:'30px'}} className={(packetstate==0)?"leftpacket":"rightpacket"}></h4>
          </div>
          <div>
          <img src={fireimg} style={{width:'420px',paddingLeft:'650px',marginTop:'-40px'}}></img>
          </div>
        </div>
        <br></br>
        <br></br>
        <br></br>
        <div>
            <h2>Send Packet</h2>
            {/* <br></br> */}
            <input type="text" id='ip' placeholder='Ip address' onChange={update} required></input>
            <br></br>
            <input type="number" id='port' placeholder='port Number' onChange={update} required></input>
            <br></br>
            <button onClick={start} id='start'>Send Packet</button>
            <button onClick={reset} id='start'>Reset</button>

        </div>
        <br></br>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
        <div style={{display:'flex',justifyContent:'space-evenly',width:'180%',alignItems:'center'}}>
          
          <div>
          <center><h2>Whitelisting</h2></center>
              <input type="text" id='ip1' placeholder='Ip address' required></input>
              <br></br>
              <input type="number" id='port1' placeholder='port Number' required></input>
              <br></br>
              <button  id='start' onClick={whitelist}>whitelist</button>

          </div>
          <div>
          <center><h2>blacklisting</h2></center>
              <input type="text" id='ip2' placeholder='Ip address' required></input>
              <br></br>
              <input type="number" id='port2' placeholder='port Number' required></input>
              <br></br>
              <button  id='start' onClick={blacklist}>blacklist</button>

          </div>
        </div>
        <br></br>
        <br></br>
        {/* <h2>Logs</h2>
        <br></br>
        <br></br> */}
        <div>
        {/* <div id="bar"> */}
          {/* <div id="red">
          </div>
          <div id="yellow">
          </div>
          <div id="green">
          </div> */}
      {/* </div> */}
          {/* <div id="screen">
              <p class="font">{logs}</p>
          </div> */}
        </div>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
      </header>
    </div>
  );
}

export default App;
