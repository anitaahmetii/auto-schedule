using AutoMapper;
using Domain.Interface;
using Domain.Model;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Application.Services
{
    public class LecturerProfileService : ILecturerProfileService
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public LecturerProfileService(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<LecturerProfileModel> GetLecturerProfileAsync(Guid id, CancellationToken cancellationToken)
        {
            try
            {
                var lecturer = await _context.Lectures.FirstOrDefaultAsync(l => l.Id == id, cancellationToken);
                if (lecturer == null)
                {
                    throw new KeyNotFoundException("Lecturer not found.");
                }
                return _mapper.Map<LecturerProfileModel>(lecturer);
            }
            catch (OperationCanceledException ex)
            {
                throw new OperationCanceledException("The operation was cancelled.", ex);
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while retrieving the lecturer profile.", ex);
            }
        }

        public async Task<LecturerProfileModel> UpdateLecturerProfileAsync(LecturerProfileModel lecturerProfile, CancellationToken cancellationToken)
        {
            try
            {
                var lecturer = await _context.Lectures.FindAsync(new object[] { lecturerProfile.Id }, cancellationToken);
                if (lecturer == null)
                {
                    throw new KeyNotFoundException("Lecturer not found!");
                }

                _mapper.Map(lecturerProfile, lecturer);
                await _context.SaveChangesAsync(cancellationToken);
                return lecturerProfile;
            }
            catch (DbUpdateConcurrencyException ex)
            {
                throw new DbUpdateConcurrencyException("A concurrency error occurred while updating the profile.", ex);
            }
            catch (DbUpdateException ex)
            {
                throw new DbUpdateException("A database error occurred while updating the profile.", ex);
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while updating the profile.", ex);
            }
        }
    }
}
