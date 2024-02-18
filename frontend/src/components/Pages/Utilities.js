import React from 'react';
import RentStubGeneratorCard from '@/components/Cards/RentStubGeneratorCard';

const Utilities = () => {
    return (
        <section>
            <div className="flex justify-between items-center p-2">
                <h2 className="text-2xl text-white font-bold">Utilities</h2>
            </div>
            <div className='flex m-4 gap-2'>
                <RentStubGeneratorCard />
            </div>
        </section>
    );
};

export default Utilities;
