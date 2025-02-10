import React from "react";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Edit2, MoreHorizontal, User } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

/**
 * ReusableTable Component
 * @param {Object[]} data - Array of objects containing table data
 * @param {string} caption - Table caption
 * @param {Array} columns - Array of objects { key, label } defining table columns
 * @param {Function} onEdit - Function to handle edit action (receives item ID)
 * @param {Function} onViewApplicants - Function to handle viewing applicants (only for job table)
 * @param {Function} onUpdateStatus - Function to handle status update (receives item ID and new status)
 * @param {string} type - Type of table (e.g., "jobs" for job table)
 */
const ReusableTable = ({ data, caption, columns, onEdit, onViewApplicants, onUpdateStatus, type }) => {
    return (
        <div>
            <Table>
                <TableCaption>{caption}</TableCaption>
                <TableHeader>
                    <TableRow>
                        {columns.map((col) => (
                            <TableHead key={col.key}>{col.label}</TableHead>
                        ))}
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.length > 0 ? (
                        data.map((item) => (
                            <TableRow key={item.id || item._id}>
                                {columns.map((col) => (
                                    <TableCell key={col.key}>
                                        {col.render ? col.render(item) : item[col.key]}
                                    </TableCell>
                                ))}
                                <TableCell className="flex justify-end">
                                    {type === "applicants" ? (
                                        
                                        <Select
                                            value={item.status}
                                            onValueChange={(newStatus) => onUpdateStatus(item._id || item.id, newStatus)}
                                            
                                        >
                                            <SelectTrigger className="w-32">
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="pending">Pending</SelectItem>
                                                <SelectItem value="accepted">Accepted</SelectItem>
                                                <SelectItem value="rejected">Rejected</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        
                                    ) : (
                                        <Popover>
                                            <PopoverTrigger>
                                                <MoreHorizontal />
                                            </PopoverTrigger>
                                            <PopoverContent className="w-28 text-sm">
                                                {/* Edit Option */}
                                                <div
                                                    className="flex items-center gap-2 w-fit cursor-pointer"
                                                    onClick={() => onEdit(item.id || item._id)}
                                                >
                                                    <Edit2 className="size-4" />
                                                    <span>Edit</span>
                                                </div>


                                                {/* Applicants Option (Only for Job Table) */}
                                                {type === "jobs" && onViewApplicants && (
                                                    <>

                                                        <div
                                                            className="flex items-center gap-2 w-fit cursor-pointer mt-2"
                                                            onClick={() => onViewApplicants(item._id || item.id)}
                                                        >
                                                            <User className="size-4" />
                                                            <span>Applicants</span>
                                                        </div>
                                                    </>
                                                )}
                                            </PopoverContent>
                                        </Popover>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length + 1} className="text-center">
                                No data found
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
};

export default ReusableTable;
