import React, { useState } from 'react';
import { DatePicker, Select, Button, Modal, Input, Form } from 'antd';
import { FiPlus, FiTrash2 } from "react-icons/fi";
import useTaskStore from '../data/taskStore';

function Navbar({ onPriorityChange, onDateChange }) {
  const [form] = Form.useForm();
  const [date, setDate] = useState(null); // selected date
  const [open, setOpen] = useState(false);
  const [priority, setPriority] = useState(null); // selected priority

  const addTask = useTaskStore((state) => state.addTask);
  const deleteAllTasks = useTaskStore((state) => state.deleteAllTasks);
  const tasks = useTaskStore((state) => state.tasks);

  const taskDates = new Set(
    tasks
      .map((task) => task.scheduledFor || task.createdAt?.slice(0, 10))
      .filter(Boolean)
  );

  const priorityOptions = [
    { value: "high", label: "🔴 Highest Priority", color: "red", name: "Highest" },
    { value: "medium", label: "🟡 Medium Priority", color: "orange", name: "Medium" },
    { value: "low", label: "🟢 Lower Priority", color: "green", name: "Lower" },
  ];




  return (
    <div className='bg-white/20 backdrop-blur-lg h-20 w-full flex justify-between items-center px-6 md:px-8 border-b border-white/50 shadow-sm'>

      {/* Priority selector */}
      <div className='w-[30%] h-full flex justify-start items-center'>
        <div className='w-50 h-[60%]'>
          <Select
            placeholder="Choose Priority"
            size="large"
            className="w-full h-full rounded!"
            value={priority?.value || null}
            onChange={(value) => {
              const selected = priorityOptions.find(p => p.value === value);
              setPriority(selected);
              onPriorityChange(selected); // send object to TaskPage
            }}
            options={priorityOptions.map(p => ({ value: p.value, label: p.label }))}
          />
        </div>
      </div>

      {/* Other buttons: DatePicker, Add Task, Delete All, Profile */}
      <div className='flex-1 h-full flex justify-end items-center gap-4 text-slate-700'>

        <DatePicker
          size="large"
          className="w-40 rounded-xl bg-white/40 backdrop-blur-md border border-white/50 shadow-sm text-slate-700 hover:bg-white/50"
          value={date}
          onChange={(value) => {
            setDate(value);
            onDateChange(value ? value.format("YYYY-MM-DD") : null); // send selected date
          }}
          format="YYYY-MM-DD"
          cellRender={(current) => {
            const currentValue = current.format("YYYY-MM-DD");
            const hasTask = taskDates.has(currentValue);
            const isSelected = date && currentValue === date.format("YYYY-MM-DD");

            return (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '10px',
                  background: hasTask ? 'rgba(34, 197, 94, 0.22)' : isSelected ? '#e5e7eb' : '#ffffff',
                  color: hasTask ? '#166534' : '#1f2937',
                  fontWeight: isSelected ? 700 : 500,
                  border: hasTask ? '1px solid rgba(34, 197, 94, 0.45)' : 'none',
                  boxShadow: hasTask ? 'inset 0 0 0 1px rgba(34, 197, 94, 0.18)' : 'none',
                }}
              >
                {current.date()}
              </div>
            );
          }}
        />

        <Button
          onClick={() => setOpen(true)}
          size="large"
          className="px-5! flex items-center gap-2 rounded-xl bg-white/40 backdrop-blur-md text-slate-700 shadow-sm border border-white/50 hover:bg-white/60 hover:text-slate-900 font-medium"
        >
          <FiPlus /> Add Task
        </Button>

        <Button
          size="large"
          className="px-5! flex items-center gap-2 rounded-xl bg-white/40 backdrop-blur-md text-red-500 shadow-sm border border-white/50 hover:bg-white/60 hover:text-red-600 font-medium"
          onClick={() => {
            if (window.confirm("Do you want to delete all your existing tasks?")) {
              deleteAllTasks();
            }
          }}
        >
          <FiTrash2 /> Delete All
        </Button>

        <div className='bg-white/40 backdrop-blur-md border border-white/50 shadow-sm p-1 rounded-full w-12 h-12 ml-2 flex justify-center items-center'>
          <img
            src="icons/taoism.gif"
            alt="profile"
            className='w-full h-full object-cover rounded-full shadow-inner'
          />
        </div>
      </div>

      {/* Modal for Add Task */}
      <Modal
        title="Add New Task"
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => {
            addTask(values);
            setOpen(false);
            form.resetFields();
          }}
        >
          <Form.Item label="Title" name="title" rules={[{ required: true }]}>
            <Input placeholder="Enter Title" />
          </Form.Item>

          <Form.Item label="Description" name="description" rules={[{ required: true }]}>
            <Input.TextArea rows={4} placeholder="Enter Description" />
          </Form.Item>

          <Form.Item label="Priority" name="priority" rules={[{ required: true }]}>
            <Select
              placeholder="Choose Priority"
              options={priorityOptions.map(p => ({ value: p.value, label: p.label }))}
            />
          </Form.Item>

          <Form.Item
            label="For when"
            name="forWhen"
            initialValue="today"
            rules={[{ required: true, message: "Choose when you want to do this task" }]}
          >
            <Select
              options={[
                { value: "today", label: "Today" },
                { value: "tomorrow", label: "Tomorrow" },
              ]}
            />
          </Form.Item>

          <div className="flex justify-end gap-2">
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit">Save Task</Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}

export default Navbar;
