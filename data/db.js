import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import equal from '@wry/equality';
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
	contacts: Array,
	password: {
		type: String,
		required: true
	}
});

userSchema.statics.verify = verify; 

async function verify(username, password) {
	try {
		const user = await this.findOne({ email: username });
		if (!user) return false;
		if(bcrypt.compareSync(password, user.password)) return user;
		return false;
	} catch (ex) {
		throw new Error(ex);
	}
}

const User = mongoose.model('User', userSchema);

export { User };