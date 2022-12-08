import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { CardActionArea } from "@mui/material";

const Receipt = ({ data }) => {
	console.log(data);
	return (
		<Card className="col" sx={{ maxWidth: 345 }}>
			<CardActionArea>
				<CardMedia
					component="img"
					height="140"
					image={data.imgURL}
					alt="green iguana"
				/>
				<CardContent>
					<Typography gutterBottom variant="h5" component="div">
						{data.name}
					</Typography>
					<Typography variant="body2" color="text.secondary">
						{data.dateReceipt}
					</Typography>
					<Typography variant="body2" color="text.secondary">
						{data.amount}MAD
					</Typography>
				</CardContent>
			</CardActionArea>
		</Card>
	);
};

export default Receipt;
