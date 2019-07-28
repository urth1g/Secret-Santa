import React from "react"
import { Icon } from '@iconify/react';
import accountPlus from '@iconify/icons-mdi/account-plus';
import accountMinus from '@iconify/icons-mdi/account-minus';

const styles = {
	input:{
		padding:'10px',
		borderRadius:'10px',
		marginRight:'8px'
	}
}
class Form extends React.Component{
	state = {
		numberOfParticipants: 3,
		giftingPairs:[]
	}

	renderInputs = () => {
		let participants = []

		for(let i = 0; i < this.state.numberOfParticipants; i++){

			participants.push(
				<div key={i} style={{
					margin: '15px 0px'
				}}>
					<input required name="participant" placeholder={`Enter name ${i + 1}`} style={styles.input} />
					<input required name="family" placeholder={`Enter family ${i + 1}`} style={styles.input} />
					<input type="checkbox" name="availability" placeholder={`Enter name ${i + 1}`} style={styles.input} />
					<label style={styles.label}>Absent</label>
				</div>
			)
		}

		return participants;

	}

	drawNames = (drawingPool) => {

		if(drawingPool.length === 0) {
			this.setState({giftingPairs: this.pairs });
			return false;
		}

		let randomNum = Math.floor( (Math.random() * drawingPool.length ));
		let randomNum2 = Math.floor( (Math.random() * drawingPool.length ));

		let participant = this.allParticipants[randomNum2];
		let offersGiftTo = drawingPool[randomNum];

		console.log(participant);
		console.log(offersGiftTo);


		// Check if participant drew himself or someone who belongs to the same family as himself 
		if(participant.name === offersGiftTo.name || participant.family === offersGiftTo.family){
			if(drawingPool.length === 1){
				this.setState({giftingPairs: this.pairs });
				return false
			}else{
				return this.drawNames(drawingPool);
			}
		}

		// Check if one's giftee is their secret santa 
		// This is for the following case: 3 People are drawing, lets call them A,B,C 
		// A draws B
		// B draws A 
		// C draws C and gets no gift 
		let isGifteeSanta = false;

		this.pairs.forEach(x => {
			if(!isGifteeSanta){
				if(x[1].name === participant.name && x[0].name === offersGiftTo.name){
					isGifteeSanta = true;
				}
			}
		})

		if(isGifteeSanta){
			return this.drawNames(drawingPool);
		}

		// Remove the one who has drawn from an array and make the next user draw
		drawingPool.splice(randomNum, 1);
		this.allParticipants.splice(randomNum2, 1);


		this.pairs.push([participant, offersGiftTo ]);

		return this.drawNames(drawingPool);

	}

	generatePairs = () => {
		let inputs = document.getElementsByTagName("input");

		let drawingPool = [];

		let isInputEmpty = false;
		let isDuplicateName = false;


		if(inputs.length / 3 < 3){
			alert('At least 3 participants are required for playing Secret Santa!');
			return false;
		}

		for(let i = 0; i < inputs.length; i+=3){


			// In addition to HTML checking, check for name and family inputs not being empty with JS

			if(inputs[i].value.trim() === '' || inputs[i + 1].value.trim() === ''){
				isInputEmpty = true;
				break;
			}

			// Check if one user has entered multiple time into the draw

			isDuplicateName = drawingPool.filter(x => x.name === inputs[i].value).length >= 1;

			if(isDuplicateName){
				alert('Every participant can enter only one time.');
				break;
			}

			drawingPool.push({name: inputs[i].value, family: inputs[i+1].value, absent: inputs[i+2].checked})

		}

		if(isInputEmpty || isDuplicateName){
			return false;
		}
		
		let sameFamilyInDrawingPool = drawingPool.every((v,i,arr) => v.family === arr[0].family );

		if(sameFamilyInDrawingPool && drawingPool.length !== 1){
			alert('All of the participants are from same family');
			return false;
		}


		this.allParticipants = [ ...drawingPool ];
		this.pairs = [];

		this.drawNames(drawingPool);




		setTimeout( () => console.log(this.pairs), 3000);
	}

	incrementNumberOfParticipants = () => {
		this.setState({numberOfParticipants: this.state.numberOfParticipants + 1, giftingPairs: []})
	}

	decrementNumberOfParticipants = () => {
		this.setState({numberOfParticipants: this.state.numberOfParticipants !== 0 ? 
									this.state.numberOfParticipants - 1 : 
									this.state.numberOfParticipants, giftingPairs: []  })
	}

	render(){
		let Pairs = this.state.giftingPairs.map((x,i) => (
			<div key={i}>
				{x[0].name} - {x[1].name}
			</div>
		));

		return(
			<form onSubmit={e => e.preventDefault()} >
				<label>Draw names with</label>

				{this.renderInputs() }

				<div>
					<Icon 
						icon={accountPlus} 
						style={{
							fontSize:'50px',
							color:'#663399',
							cursor:'pointer'
						}} 
						onClick={ this.incrementNumberOfParticipants }
					/>

					<Icon 
						icon={accountMinus} 
						style={{
							fontSize:'50px',
							color:'#663399',
							cursor:'pointer'
						}} 
						onClick={ this.decrementNumberOfParticipants }
					/>			
				</div>	
				<div>
					<button onClick={this.generatePairs}>Generate</button>
				</div>

				{Pairs.length > 0 && 				
					<div> 
						Pairs:
						{Pairs}
					</div>
				}
			</form>
		)
	}
}

export default Form;