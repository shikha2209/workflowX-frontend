import { Card, Typography } from "@mui/material";

interface Props {
  title: string;
  value: string;
}

export default function StatCard({
  title,
  value,
}: Props) {
  return (
    <Card
      sx={{
        p: 3,
        borderRadius: 4,
        boxShadow: 2,
      }}
    >
      <Typography
        sx={{
          color: "gray",
          fontSize: 14,
        }}
      >
        {title}
      </Typography>

      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          mt: 1,
        }}
      >
        {value}
      </Typography>
    </Card>
  );
}