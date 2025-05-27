import type {BioSample} from '../../types';
import BioSampleItem from './BioSampleItem.tsx';

interface BioSampleListProps {
    samples: BioSample[];
    onSelectSample: (sample: BioSample) => void;  // Callback invoked when a sample is selected
}

export default function BioSampleList({samples, onSelectSample}: BioSampleListProps) {
    if (samples.length === 0) {
        return (
            <div className="p-8 text-center text-gray-500">
                <p className="text-lg">No samples found</p>
                <p className="text-sm mt-2">Create your first biosample to get started</p>
            </div>
        );
    }
    return (
        <div className="p-4 bg-background-beige grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {samples.map(sample => (
                <div
                    key={sample.id}
                    onClick={() => onSelectSample(sample)}
                    className="cursor-pointer rounded-xl border border-neutral-200 bg-white p-6 transition duration-200 ease-in-out transform hover:opacity-100 hover:shadow-[0_12px_20px_-4px_rgba(0,0,0,0.25)] hover:scale-[1.01] opacity-85"
                >
                    <BioSampleItem sample={sample}/>
                </div>
            ))}
        </div>
    );
}