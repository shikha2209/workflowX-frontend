import {
  Box,
  Typography,
} from "@mui/material";

import {
  useState
} from "react";

interface Props {

  text: string;

  wordLimit: number;

  titleStyle?: object;

  textStyle?: object;

}

export default function ExpandableText({

  text,

  wordLimit,

  titleStyle,

  textStyle,

}: Props) {

  const [expanded,
  setExpanded] =
  useState(false);

  const words =
  text.split(" ");

  const shouldTruncate =
  words.length > wordLimit;

  const truncatedText =
  words
  .slice(0, wordLimit)
  .join(" ");

  return (

    <Box>

      <Typography
        sx={{

          ...titleStyle,

          ...textStyle,

          display:"inline",

        }}
      >

        {

        expanded

        ? text

        : shouldTruncate

        ? `${truncatedText}...`

        : text

        }

      </Typography>

      {shouldTruncate && (

        <Typography

          component="span"

          onClick={() =>
            setExpanded(
              !expanded
            )
          }

          sx={{

            ml:0.7,

            fontSize:13,

            color:"#2563eb",

            cursor:"pointer",

            fontWeight:500,

            display:"inline",

          }}
        >

          {

          expanded

          ? "Show Less"

          : ""

          }

        </Typography>

      )}

    </Box>

  );

}