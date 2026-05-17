import { motion } from "framer-motion";

// Define the reveal variants for a "Fade-in and Slide-up" effect
const revealVariants = {
  hidden: { opacity: 0, y: 50 }, // Start invisible and 50px lower
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: "easeOut" } 
  }
};

const ProjectCard = ({ children, amount }) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount }} // Trigger once when 20% of the card is visible
    variants={revealVariants}
    className="grid__4"
  >
    {children}
  </motion.div>
);

export default ProjectCard;