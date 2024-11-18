import React from 'react'
import { sidebarIcon } from '../../../constant'

const Coordinatemenu = ({ isCoordinate, setisCoordinate, CenterCoordinets, ToggleCenterBoundBtn }) => {
    return (
        <>
            <div class=" absolute top-[9rem] left-48  w-[700px] bg-slate-200 rounded-sm shadow-md pb-3">
                <div className='flex bg-blue-800 justify-between items-center px-2 py-1.5 '>
                    <h1 class="text-lg flex items-center font-normal text-white  leading-tight mb-0">Specify Your AOI</h1>
                    <img onClick={() => setisCoordinate(!isCoordinate)} src={sidebarIcon.GE_Cancel_128} alt={sidebarIcon.GE_Cancel_128} className="w-3 h-3 mr-2" />
                </div>

                <div className=' px-2 bg-blue-500  py-2'>
                    <div className='d-flex  gap-2 pl-6 '>
                        <button
                            onClick={() => ToggleCenterBoundBtn(true)}
                            className={`text-sm font-normal leading-tight px-2 py-1 ${CenterCoordinets ? "bg-[#5f73b7] text-white" : "bg-white text-black"} rounded-sm shadow-md`}>
                            Center Coordinates
                        </button>
                        <button
                            onClick={() => ToggleCenterBoundBtn(false)}
                            className={`text-sm font-normal leading-tight px-2 py-1 ${!CenterCoordinets ? "bg-[#5f73b7] text-white" : "bg-white text-black"} rounded-sm`}>
                            Bound Coordinates
                        </button>

                    </div>
                </div>


                <div className=' px-3 mt-1'>
                    <h2 class="text-base bg-[#5f73b7]   font-normal text-white  leading-tight py-1   px-2 italic ">{CenterCoordinets ? "Center Coordinates" : "Upper Left"} </h2>




                    {
                        CenterCoordinets ? (
                            <div class="grid  grid-cols-[40%_auto] gap-4 items-center px-6 ">
                                <div>
                                    <h2 className='text-sm text-center italic ' >Degree Decimal(DD) </h2>
                                    <div class="">
                                        <div className='flex gap-4 mb-2'>
                                            <label class=" text-sm font-semibold block text-black">Latitude</label>
                                            <input type="text" class="border rounded-sm px-2 w-24 " value="21.25" />
                                            <span className=' -mt-1 -ml-5 text-lg font-bold'>° </span>

                                        </div>

                                        <div className='flex gap-2 '>
                                            <label class=" text-sm font-semibold block text-black ">Longitude</label>
                                            <input type="text" class="border rounded-sm px-2 ml-1 w-24" value="80.50" />
                                            <span className=' -mt-1 -ml-1 text-lg font-bold'>° </span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div class="flex  gap-4 mb-1">
                                        <div class="text-center  font-medium italic text-sm">Degree °</div>
                                        <div class="text-center font-medium italic text-sm ">Minutes '</div>
                                        <div class="text-center font-medium italic text-sm ">Second "</div>
                                        <div class="text-center font-medium italic text-sm ">DMS</div>
                                    </div>

                                    <div class="flex gap-3 mb-2">
                                        <div className=' flex text-center '><input type="number" class="border rounded-sm w-14 text-center text-sm " value="21" />    <span className='-mt-1 text-lg font-bold'> ° </span> </div>
                                        <div className='flex text-center '> <input type="number" class="border rounded-sm w-14 text-center text-sm " value="15" /> <span className=' -mt-1 text-lg font-bold '>' </span></div>
                                        <div className='flex text-center '>  <input type="number" class="border rounded-sm  w-14 text-center text-sm " value="0.00" /> <span className=' -mt-1 text-lg font-bold '> " </span> </div>
                                        <div className='text-center'> <input type="" class="border rounded-sm w-14 text-center text-sm " value="N/S" /></div>
                                    </div>
                                    <div class="flex gap-3 ">
                                        <div className=' flex text-center '><input type="number" class="border rounded-sm w-14 text-center text-sm " value="21" />    <span className='-mt-1 text-lg font-bold'> ° </span> </div>
                                        <div className='flex text-center '> <input type="number" class="border rounded-sm w-14 text-center text-sm " value="12" /> <span className=' -mt-1 text-lg font-bold'>' </span></div>
                                        <div className='flex text-center '>  <input type="number" class="border rounded-sm  w-14 text-center text-sm " value="0.00" /> <span className=' -mt-1  text-lg font-bold'> " </span> </div>
                                        <div className='text-center'> <input type="" class="border rounded-sm w-14 text-center text-sm " value="N/S" /></div>
                                    </div>

                                </div>
                            </div>
                        ) : (
                            <div class="flex  gap-4 items-center px-6 ">
                                <div>
                                    <h2 className='text-sm text-center italic ' >Degree Decimal(DD) </h2>
                                    <div class="">
                                        <div className='flex gap-4 mb-2'>
                                            <label class=" text-sm font-semibold block text-black">Latitude</label>
                                            <input type="text" class="border rounded-sm px-2 w-24 " value="21.25" />
                                            <span className=' -mt-1 -ml-5 text-lg font-bold'>° </span>

                                        </div>

                                        <div className='flex gap-2 '>
                                            <label class=" text-sm font-semibold block text-black ">Longitude</label>
                                            <input type="text" class="border rounded-sm px-2 ml-1 w-24" value="80.50" />
                                            <span className=' -mt-1 -ml-1 text-lg font-bold'>° </span>
                                        </div>
                                    </div>
                                </div>

                                <div className='hidden sm:block w-[1px]  mt-3 h-16 bg-[#4983c1]'>

                                </div>

                                <div className=''>

                                    <div class="flex  gap-4 mb-1">
                                        <div class="text-center  font-medium italic text-sm">Degree °</div>
                                        <div class="text-center font-medium italic text-sm ">Minutes '</div>
                                        <div class="text-center font-medium italic text-sm ">Second "</div>
                                        <div class="text-center font-medium italic text-sm ">DMS</div>
                                    </div>


                                    <div class="flex gap-3 mb-2">
                                        <div className=' flex text-center '><input type="number" class="border rounded-sm w-14 text-center text-sm " value="21" />    <span className='-mt-1 text-lg font-bold'> ° </span> </div>
                                        <div className='flex text-center '> <input type="number" class="border rounded-sm w-14 text-center  text-sm" value="15" /> <span className=' -mt-1 text-lg font-bold '>' </span></div>
                                        <div className='flex text-center '>  <input type="number" class="border rounded-sm  w-14 text-center text-sm " value="0.00" /> <span className=' -mt-1 text-lg font-bold '> " </span> </div>
                                        <div className='text-center'> <input type="" class="border rounded-sm w-14 text-center text-sm " value="N/S" /></div>
                                    </div>
                                    <div class="flex gap-3 ">
                                        <div className=' flex text-center '><input type="number" class="border rounded-sm w-14 text-center  text-sm" value="21" />    <span className='-mt-1 text-lg font-bold'> ° </span> </div>
                                        <div className='flex text-center '> <input type="number" class="border rounded-sm w-14 text-center  text-sm" value="12" /> <span className=' -mt-1 text-lg font-bold'>' </span></div>
                                        <div className='flex text-center '>  <input type="number" class="border rounded-sm  w-14 text-center  text-sm" value="0.00" /> <span className=' -mt-1  text-lg font-bold'> " </span> </div>
                                        <div className='text-center'> <input type="" class="border rounded-sm w-14 text-center text-sm " value="N/S" /></div>
                                    </div>

                                </div>
                            </div>

                        )
                    }



                </div>


                <div className='px-3 mt-3'>
                    <h2 class="text-base bg-[#5f73b7]   font-normal text-white  leading-tight py-1   px-2 italic ">{CenterCoordinets ? " Buffer Dimention" : "Lower Left"}  </h2>

                    {
                        CenterCoordinets ? (
                            <div class="flex justify-center  space-x-2">
                                <div class="switch-container ml-6 md:ml-12">
                                    <label class="switch-label">Squre</label>
                                    <input class="check_switch" type="checkbox" />
                                    <label class="switch-label">Rectangle</label>
                                </div>
                            </div>
                        ) : (
                            <div class="flex   gap-4 items-center px-6 ">
                                <div>
                                    <h2 className='text-sm text-center italic ' >Degree Decimal(DD) </h2>
                                    <div class="">
                                        <div className='flex gap-4 mb-2'>
                                            <label class=" text-sm font-semibold block text-black">Latitude</label>
                                            <input type="text" class="border rounded-sm px-2 w-24 " value="21.25" />
                                            <span className=' -mt-1 -ml-5 text-lg font-bold'>° </span>

                                        </div>

                                        <div className='flex gap-2 '>
                                            <label class=" text-sm font-semibold block text-black ">Longitude</label>
                                            <input type="text" class="border rounded-sm px-2 ml-1 w-24" value="80.50" />
                                            <span className=' -mt-1 -ml-1 text-lg font-bold'>° </span>
                                        </div>
                                    </div>
                                </div>


                                <div className='hidden sm:block w-[1px]  mt-3 h-16 bg-[#4983c1]'>

                                </div>

                                <div className=''>

                                    <div class="flex  gap-4 mb-1">
                                        <div class="text-center  font-medium italic text-sm">Degree °</div>
                                        <div class="text-center font-medium italic text-sm ">Minutes '</div>
                                        <div class="text-center font-medium italic text-sm ">Second "</div>
                                        <div class="text-center font-medium italic text-sm ">DMS</div>
                                    </div>


                                    <div class="flex gap-3 mb-2">
                                        <div className=' flex text-center '><input type="number" class="border rounded-sm w-14 text-center  text-sm" value="21" />    <span className='-mt-1 text-lg font-bold'> ° </span> </div>
                                        <div className='flex text-center '> <input type="number" class="border rounded-sm w-14 text-center  text-sm" value="15" /> <span className=' -mt-1 text-lg font-bold '>' </span></div>
                                        <div className='flex text-center '>  <input type="number" class="border rounded-sm  w-14 text-center text-sm" value="0.00" /> <span className=' -mt-1 text-lg font-bold '> " </span> </div>
                                        <div className='text-center'> <input type="" class="border rounded-sm w-14 text-center text-sm " value="N/S" /></div>
                                    </div>
                                    <div class="flex gap-3 ">
                                        <div className=' flex text-center '><input type="number" class="border rounded-sm w-14 text-center  text-sm" value="21" />    <span className='-mt-1 text-lg font-bold'> ° </span> </div>
                                        <div className='flex text-center '> <input type="number" class="border rounded-sm w-14 text-center  text-sm" value="12" /> <span className=' -mt-1 text-lg font-bold'>' </span></div>
                                        <div className='flex text-center '>  <input type="number" class="border rounded-sm  w-14 text-center text-sm " value="0.00" /> <span className=' -mt-1  text-lg font-bold'> " </span> </div>
                                        <div className='text-center'> <input type="" class="border rounded-sm w-14 text-center text-sm " value="N/S" /></div>
                                    </div>

                                </div>
                            </div>
                        )
                    }


                    {
                        CenterCoordinets ? (
                            <div className='flex px-3  items-center gap-14 my-2'>
                                <div class="">
                                    <div className='flex gap-4 mb-2'>
                                        <label class=" text-sm font-semibold block text-black">Side Length</label>
                                        <span>
                                            <input type="text" class="border rounded-sm px-2 w-24 " value="21.25" /> km
                                        </span>
                                    </div>

                                    <div className='flex gap-2 '>
                                        <label class=" text-sm font-semibold block text-black ">Square Area </label>
                                        <span>
                                            <input type="text" class="border rounded-sm px-2 md:ml-3.5 w-24" value="80.50" /> sq km
                                        </span>
                                    </div>
                                </div>

                                <div className='hidden sm:block w-[1px] h-16 bg-[#4983c1]'>

                                </div>

                                <div>
                                    <div>
                                        <div class="bg-slate-300 py-2 px-8 w-full">
                                            <div class="d-flex items-center gap-10 mb-2 ">
                                                <label class=" text-sm font-semibold block text-black">Width</label>
                                                <div class="flex">
                                                    <input type="text" class="text-end border rounded-sm px-2 ml-1 w-24" value="5.00" step="0.01" />
                                                    <span class="ml-1"> km</span>
                                                </div>
                                            </div>
                                            <div class="d-flex items-center gap-10">
                                                <label class=" text-sm font-semibold block text-black">Height</label>
                                                <div class="flex">
                                                    <input type="text" class="text-end border rounded-sm px-2  w-24" value="5.00" step="0.01" />
                                                    <span class="ml-1"> km</span>
                                                </div>
                                            </div>


                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : null

                    }


                </div>

                <hr />
                <div class="flex justify-center gap-4 md:gap-8 mt-4">

                    <button

                        class="text-black hover:text-Info_info font-semibold px-3  border-[1px]  border-gray-400  hover:border-Info_info  rounded-sm  bg-white">
                        Cancel
                    </button>
                    <button class="text-black hover:text-Info_info font-semibold px-3  border-[1px]  border-gray-400  hover:border-Info_info  rounded-sm  bg-white">
                        Reset
                    </button>

                    <button class="bg-blue-800 hover:bg-blue-600 text-white font-semibold py-1 px-4 rounded-sm ">OK</button>
                </div>

            </div>

        </>
    )
}

export default Coordinatemenu