import mongoose from 'mongoose';

mongoose.connect(`mongodb://localhost/graphql`, {
	useNewUrlParser: true,
}, (err) => {
	if (err) throw new Error(err)
	console.log('db connected successfully');
});

const userSchema = new mongoose.Schema({
	id: String,
	firstName: String,
	lastName: String,
	gender: String,
	age: Number,
	language: String,
	email: String,
	contacts: Array
});

exports.User = mongoose.model('User', userSchema);