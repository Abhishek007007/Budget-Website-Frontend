import React, { useEffect } from "react";
import { MDBCard } from "mdb-react-ui-kit";
import { useDispatch, useSelector } from "react-redux";
import { getIncomeSourceList, getIncomeItemsList } from "./../redux/incomeSlice";
import IncomeSource from "./IncomeSource";
import IncomeItems from "./IncomeItems";
import { Divider } from "antd";
import { motion } from "framer-motion"; // Import framer-motion

function Income() {
  const income = useSelector((state) => state.income);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!income.success && income.error === null) {
      dispatch(getIncomeSourceList());
      dispatch(getIncomeItemsList());
    }
  }, [dispatch, income.success]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }} // Start with opacity 0 and 50px down
      animate={{ opacity: 1, y: 0 }}   // Animate to full opacity and original position
      exit={{ opacity: 0, y: 50 }}     // Fade out and move down when exiting
      transition={{ duration: 0.6 }}   // Animation duration
      className="w-100 h-100 p-3"
    >
      <div className="w-100 h-100 p-3 d-flex flex-column overflow-hidden">
        <div className="w-100 h-100 d-flex flex-column">
          {/* IncomeSource with animation */}
          <motion.div
            initial={{ opacity: 0, x: -50 }} // Slide from left
            animate={{ opacity: 1, x: 0 }}    // Slide into position
            transition={{ duration: 0.6 }}
          >
            <IncomeSource className="overflow-auto" />
          </motion.div>

          {/* Divider with animation */}
          <motion.div
            initial={{ opacity: 0 }}  // Start with invisible divider
            animate={{ opacity: 1 }}  // Fade-in the divider
            transition={{ delay: 0.6, duration: 0.4 }}  // Delay after IncomeSource
          >
            <Divider />
          </motion.div>

          {/* IncomeItems with animation */}
          <motion.div
            initial={{ opacity: 0, x: 50 }} // Slide from right
            animate={{ opacity: 1, x: 0 }}   // Slide into position
            transition={{ duration: 0.6 }}
          >
            <IncomeItems />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default Income;
