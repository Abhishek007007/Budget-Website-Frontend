import React from "react";
import { motion } from "framer-motion"; // Import framer-motion for animations
import ExpenseCategory from "./expenseCategory";
import { Divider } from "antd";
import ExpenseItems from "./ExpenseItems";

function Expenses() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }} // Start with opacity 0 and 50px down
      animate={{ opacity: 1, y: 0 }}   // Animate to full opacity and original position
      exit={{ opacity: 0, y: 50 }}     // Fade out and move down when exiting
      transition={{ duration: 0.6 }}    // Animation duration
      className="w-100 h-100 p-3"
    >
      <motion.div
        className="w-100 h-100 d-flex flex-column"
        initial={{ opacity: 0 }}        // Initial state for the content
        animate={{ opacity: 1 }}        // Final state for fade-in
        transition={{ delay: 0.3, duration: 0.6 }}  // Slight delay before fade-in
      >
        {/* ExpenseCategory with animation */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}  // Slide from left
          animate={{ opacity: 1, x: 0 }}    // Slide into position
          transition={{ duration: 0.6 }}
        >
          <ExpenseCategory className="overflow-auto" />
        </motion.div>

        {/* Divider with animation */}
        <motion.div
          initial={{ opacity: 0 }}  // Start with invisible divider
          animate={{ opacity: 1 }}  // Fade-in the divider
          transition={{ delay: 0.6, duration: 0.4 }}  // Delay after category section
        >
          <Divider />
        </motion.div>

        {/* ExpenseItems with animation */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}  // Slide from right
          animate={{ opacity: 1, x: 0 }}    // Slide into position
          transition={{ duration: 0.6 }}
        >
          <ExpenseItems />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default Expenses;
