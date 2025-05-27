import type {BioSample} from '../../types';
import {FileText} from 'lucide-react';

export default function BioSampleItem({sample}: { sample: BioSample }) {
    return (
        <div className="flex flex-col gap-3 w-full max-w-sm">
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
                    <span
                        className="text-base font-medium text-gray-900 truncate whitespace-nowrap overflow-hidden w-full block">
                        {sample.location}
                    </span>
                </div>
            </div>

            {/* Sample type */}
            <div className="text-sm text-gray-600 truncate whitespace-nowrap overflow-hidden">
                {sample.sampleTypeName}
            </div>
        </div>
    );
}
