import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../utils/Layout.jsx'
import axios from 'axios'
import { server } from '../../main.jsx'
import "./dashboard.css"

const AdminDashboard = ({user}) => {
    const navigate=useNavigate()
    if(user && user.role !=="admin") return navigate("/");

   const [stats, setStats] = useState({
     totalcourses: 0,
     totallectures: 0,
     totalusers: 0,
   }); 
    async function fetchstats(){
        try {
            const {data}=await axios.get(`${server}/api/stats`,{
                headers:{
                    token:localStorage.getItem("token")
                }
            })
            setStats(data.stats)
            
        } catch (error) {
            console.log(error)
            
        }
    }   
    useEffect(()=>{
        fetchstats()
    },[])
  return (
    <div>
      <Layout>
        <div className="main-content">
          <div className="box">
            <p>Total Courses</p>
            <p>{stats.totalcourses}</p>
          </div>
          <div className="box">
            <p>Total Lectures</p>
            <p>{stats.totallectures}</p>
          </div>
          <div className="box">
            <p>Total Users</p>
            <p>{stats.totalusers}</p>
          </div>
        </div>
      </Layout>
    </div>
  );
}

export default AdminDashboard
