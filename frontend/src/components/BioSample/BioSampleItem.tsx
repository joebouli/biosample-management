import type {BioSample} from '../../types';
import {FileText} from 'lucide-react';

interface BioSampleItemProps {
    sample: BioSample;
    onClick?: () => void;
}

export default function BioSampleItem({sample, onClick}: BioSampleItemProps) {
    return (
        <div
            onClick={onClick}
            className="flex flex-col gap-3 w-full max-w-sm cursor-pointer rounded-xl border border-neutral-200 bg-white p-6 transition duration-200 ease-in-out transform hover:opacity-100 hover:shadow-[0_12px_20px_-4px_rgba(0,0,0,0.25)] hover:scale-[1.01] opacity-85"
        >
            {/* Icon */}
            <div className="flex items-center gap-3">
                <div className="bg-green-100 text-green-700 p-2 rounded-md flex items-center justify-center">
                    <FileText className="w-4 h-4"/>
                </div>

                {/* Sampling date and location */}
                <div className="flex flex-col w-full overflow-hidden">
                    <span className="text-sm text-gray-500">
                        {new Date(sample.samplingDate).toLocaleDateString()}
                    </span>
                    <span className="text-base font-medium text-gray-900 truncate">
                        {sample.location}
                    </span>
                </div>
            </div>

            {/* Sample type */}
            <div className="text-sm text-gray-600 truncate">
                {sample.sampleTypeName}
            </div>
        </div>
    );
}
