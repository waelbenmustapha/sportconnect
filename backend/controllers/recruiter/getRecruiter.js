
export default async (req, res) => {
    try {
    
        res.status(200).json({ recruiter: req.recruiter });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  