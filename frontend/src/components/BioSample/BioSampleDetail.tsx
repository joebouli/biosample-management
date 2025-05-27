import {Pencil, Trash2} from 'lucide-react'
import type {BioSample} from '../../types';
import IconButton from "../UI/IconButton.tsx";

type Props = {
    sample: BioSample;
    onEditClick: () => void;
    onDeleteClick: () => void;
};

export default function BioSampleDetail({sample, onEditClick, onDeleteClick}: Props) {
    return (

        <div className="relative bg-white p-6 rounded-xl shadow-md space-y-4">

            {/* Main horizontal layout */}
            <div className="flex justify-between">

                {/* Left side: Sample information */}
                <div className="flex-1 pr-6">
                    <h2 className="text-xl font-semibold text-green-900 mb-4">Sample Information</h2>

                    {/* Grid layout */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Display sample location */}
                        <p>
                            <span className="font-medium text-gray-600">Location:</span> {sample.location}
                        </p>
                        {/* Display sample type */}
                        <p>
                            <span className="font-medium text-gray-600">Type:</span> {sample.sampleTypeName}
                        </p>
                        {/* Display sampling date formatted as locale date string */}
                        <p>
                            <span
                                className="font-medium text-gray-600">Sampling Date:</span> {new Date(sample.samplingDate).toLocaleDateString()}
                        </p>
                        {/* Display operator name */}
                        <p>
                            <span className="font-medium text-gray-600">Operator:</span> {sample.operatorName}
                        </p>
                    </div>
                </div>

                {/* Right side: Edit and Delete buttons vertically stacked */}
                <div className="flex flex-col justify-between gap-2">

                    <IconButton onClick={onEditClick} title="Edit BioSample">
                        <Pencil size={18}/>
                    </IconButton>

                    <IconButton onClick={onDeleteClick} title="Delete BioSample">
                        <Trash2 size={18}/>
                    </IconButton>
                </div>
            </div>
        </div>
    );
}
