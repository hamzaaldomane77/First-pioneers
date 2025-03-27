import React from 'react';
import { motion } from 'framer-motion';
import '../styles/loading.css';

const LoadingAnimation = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <motion.div
      className="loading-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="loading-container">
        <div className="loading-circle"></div>
        <div className="loading-circle"></div>
        <div className="loading-circle"></div>
        <div className="loading-pulse"></div>
        <motion.div 
          className="loading-text"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          جاري التحميل...
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LoadingAnimation; 