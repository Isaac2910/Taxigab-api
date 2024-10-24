
import express from "express";




export const getLoggedInUserData = async (req, res) => {
    try {
      const user = req.user;
  
      res.status(201).json({
        success: true,
        user,
      });
    } catch (error) {
      console.log(error);
    }
  };
  