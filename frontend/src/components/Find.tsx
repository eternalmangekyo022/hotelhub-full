// hooks
import { useState } from 'react'

// styles
import './styles/find.scss'

// images
import Filter from '../assets/images/Filter Iconvector.svg'
import Search from '../assets/images/Search Iconvector.svg'
import SearchPurple from '../assets/images/Search Iconvector Purple.svg'
import Location from '../assets/images/Location Iconvector.svg'



export default function Find() {
	// input for simple search
	const [input, setInput] = useState('');

	//input for complex search
	const [cusine, setCusine] = useState('');
	const [location, setLocation] = useState('');
	const [name, setName] = useState('');

	// determines whether simple search is enabled or not
	const [isSimple, setIsSimple] = useState(true);

	//prevent reloading page when submitting form
	const onSubmit: React.FormEventHandler<HTMLFormElement> = e => {
		e.preventDefault()
	}

	return <section className='find-wrapper'>
		<div className='search'>
			<h1>Find Your Perfect Stay</h1>
			<h2>Search by Cuisine, Location, or Name</h2>
			<div className='searchbar'>
				<form onSubmit={e => onSubmit(e)} className={`input${isSimple ? '': ' complex'}`}>
					{isSimple ? <>
						<img id='searchImage' src={Search} alt="Search icon" title="Search" />
						<input type="text" placeholder='Search for restaurants' value={input} onChange={e => setInput(e.target.value)} />
						<img id='filterImage' onClick={() => setIsSimple(false)} src={Filter} alt="Filter" />
					</>: <>
						<input placeholder='Cusine' type="text" className='cusine'  value={cusine} onChange={e => setCusine(e.target.value)}/>
						<div className='location-input'>
							<img src={Location} alt="Location" />
							<input placeholder='Location' type="text" className='location' value={location} onChange={e => setLocation(e.target.value)}/>
						</div>
						<input placeholder='Name' type="text" className='name' value={name} onChange={e => setName(e.target.value)}/>
						<button className='simple-button' onClick={() => setIsSimple(true)}>
							Simple search
						</button>
					</>}
					<button className='search-button' type="submit">
						<img src={SearchPurple} alt="Search" title='Search' />
					</button>
				</form>
			</div>
		</div>
		
	</section>
}