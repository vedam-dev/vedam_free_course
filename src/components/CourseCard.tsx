// components/CourseCard.tsx
import React from "react";
import Image from "next/image";
import { Box, Card, Typography } from "@mui/material";
import BaseButton from "./BaseButton";
import PersonIcon from '@mui/icons-material/Person';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import VisibilityIcon from '@mui/icons-material/Visibility';
import StarIcon from '@mui/icons-material/Star';
type Course = {
  id: string;
  color: string;
  image: string;
  companyname: string;
  coursename: string;
  level: string;
  time: string;
  viewed: string;
  usedby: string;
};

interface CourseCardProps {
  course: Course;
}
const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  console.log(course);

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection:{xs:'column',md:'row'},
        borderRadius: "40px",
        boxShadow: 3,
        overflow: {xs:'visible',md:'hidden'},
        minHeight: 300,
        background: course.color,
      }}
    >
      <Box
        sx={{
          position: "relative",
          flex: {xs:"0 60% 0" , md:"0 0 60%"},
          display: "flex",
          alignItems: "center",
        }}
      >
        <Box>
          <Image
            src={course.image}
            alt={`${course.companyname} instructor`}
            width={300}
            height={380}
            style={{
              alignSelf: "flex-start",
              position: "absolute",
              top: "32px",
              left: 16,
              objectFit: "cover",
            }}
          />
        </Box>

        <Box
          sx={{
            position: "absolute",
            right: "40px",
            top: "45%",
            transform: "translateY(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            zIndex: 2,
          }}
        >
          <Box sx={{ mb: -1 }}>
            <Image
              src="/home/star.png"
              width={80}
              height={80}
              alt="star"
              style={{
                filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.3))",
              }}
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
              mb: 1,
            }}
          >
            <Box
              sx={{
                width: 60,
                height: "2px",
                backgroundColor: "#333",
                borderRadius: "1px",
              }}
            />
            <Typography
              variant="subtitle2"
              sx={{
                textTransform: "uppercase",
                fontSize: "16px",
                fontWeight: 600,
                letterSpacing: "3px",
                color: "#333",
                whiteSpace: "nowrap",
              }}
            >
              Taught by
            </Typography>
            <Box
              sx={{
                width: 60,
                height: "2px",
                backgroundColor: "#333",
                borderRadius: "1px",
              }}
            />
          </Box>

          <Typography
            sx={{
              fontFamily: "Outfit, sans-serif",
              fontSize: "72px",
              fontWeight: 700,
              lineHeight: "58px",
              color: "#fff",
              textShadow: [
                "-2px  0    0 #000",
                " 0   -2px  0 #000",
                " 0    2px  0 #000",
                "-2px -2px  0 #000",
                " 2px -2px  0 #000",
                "-2px 2px   0 #000",
                " 2px 2px   0 #000",
                "0px  8px  0px #000",
              ].join(","),
              mb: 1,
            }}
          >
            GOOGLE
          </Typography>

          <Typography
            sx={{
              color: "#F25C05",
              fontFamily: "Outfit, Arial, sans-serif",
              fontSize: "64px",
              fontWeight: 600,
              lineHeight: "50px",
              textShadow: "0 2px 4px rgba(0,0,0,0.2)",
            }}
          >
            Instructor
          </Typography>
        </Box>
      </Box>

      {/* Right white panel */}
      <Box
        sx={{
          flex: 1,
          p: 4,
          pl: 2,
          pr:4,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
     
        <Typography
          variant="h5"
          sx={{
            textAlign: "left",
            color: "#000",
            fontFamily: "Outfit, sans-serif",
            fontSize: "30px",
            fontStyle: "normal",
            fontWeight: 600,
            lineHeight: "36px",
            display: "inline-block",
            verticalAlign: "text-top",
            mb: 1 
          }}
        >
          {course.coursename}
        </Typography>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 1 }}>
        
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
           
            <PersonIcon sx={{ fontSize: 20, color: "#666" }} />
            
            <Typography
              variant="body2"
              sx={{
                color: "#000",
                fontFamily: "Outfit, sans-serif",
                fontSize: "16px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "36px",
                display: "inline-block",
                verticalAlign: "text-top",
              }}
            >
              {course.level} Level
            </Typography>
          </Box>

      
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
        
            <AccessTimeIcon sx={{ fontSize: 20, color: "#666" }} />
            
            <Typography
              variant="body2"
              sx={{
                color: "#000",
                fontFamily: "Outfit, sans-serif",
                fontSize: "16px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "36px",
                display: "inline-block",
                verticalAlign: "text-top",
              }}
            >
              Less than {course.time} hours
            </Typography>
          </Box>
        </Box>
        

        {course.viewed === "true" && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 1 }}>
       
            <VisibilityIcon sx={{ fontSize: 20, color: "#666" }} />
            
            <Typography
              variant="body2"
              sx={{
                color: "#000",
                fontFamily: "Outfit, sans-serif",
                fontSize: "16px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "36px",
                display: "inline-block",
                verticalAlign: "text-top",
              }}
            >
              Viewed
            </Typography>
          </Box>
        )}


        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 3 }}>

          <StarIcon sx={{ fontSize: 20, color: "#666" }} />
          
          <Typography
            variant="body2"
            sx={{
              color: "#171717",
              fontFamily: "Outfit, sans-serif",
              fontSize: "12px",
              fontStyle: "normal",
              fontWeight: 300,
              lineHeight: "36px",
              display: "inline-block",
              verticalAlign: "text-top",
            }}
          >
            Used by top companies like {course.usedby}
          </Typography>
        </Box>

      
        <Box sx={{ display: "flex", gap: 2 }}>
          <BaseButton variant="outlined" fullWidth sx={{fontSize:'16px',lineHeight:'28px', textWrap:'nowrap'}}>
            Show Details
          </BaseButton>
          <BaseButton variant="contained" fullWidth sx={{fontSize:'16px',lineHeight:'28px',textWrap:'nowrap'}}>
            Start Free
          </BaseButton>
        </Box>
      </Box>
    </Card>
  );
};

export default CourseCard;
